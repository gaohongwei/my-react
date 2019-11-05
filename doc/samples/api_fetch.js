/* eslint-disable no-await-in-loop */
import fetch from 'isomorphic-fetch';
import { fetchLatestToken } from './withAuth';
import sleep from '../utils/sleep';
import logger from '../utils/logger';
import tryPromiseUntil from '../utils/tryPromiseUntil';

const errorStatuses = {
  FATAL: 'FATAL',
  FAILED: 'FAILED',
  INFO: 'INFO'
};

export class ApiError extends Error {
  constructor({ status, message, errorClass, options, backendStack }) {
    super(message);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;

    this.TYPE = 'ApiError';
    this.errorClass = errorClass;
    this.status = status;
    this.isFatal = status === errorStatuses.FATAL;
    this.options = options;
    this.backendStack = backendStack;
  }
}

export class UnexpectedApiError extends Error {
  constructor({ status, message }) {
    super(message);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
    this.TYPE = 'UnexpectedApiError';
    this.status = status;
  }
}

const getApiRetries = () => {
  // Allow capybara to set this during tests, so tests do not
  // have to wait for 30 seconds.
  const tries = localStorage.getItem('apiRetries');
  if (tries) return parseInt(tries, 10);
  return 5;
};

function jobHasFailed(job) {
  return job.status === 'FAILED' || job.status === 'FATAL';
}

function jobHasMessage(job) {
  return job.status === 'INFO';
}

function baseHeaders() {
  const idToken = fetchLatestToken();

  return {
    Accept: 'application/json',
    Authorization: `Bearer ${idToken}`
  };
}

async function fetchJson(path, options) {
  const response = await fetch(path, options);

  if (response.status === 401) {
    throw new ApiError({
      status: 'FATAL',
      message: 'Your session has expired. Please log back in using the Partner Portal.',
      errorClass: null
    });
  } else if (response.status >= 400) {
    // TODO. We want to throw UnexpectedApiError here in order to launch
    // ErrorOverlay (see actions.js extract) during development, however,
    // in case where quote is not yet created, the quote will not reload
    // on retry, causing the following spec to fail:
    // https://github.com/SunPower/equinox/blob/42e1ac2e0a9df9d412890c1153c998fb96632dfc/spec/features/quote_spec.rb#L23
    return null;
  }

  const jsonBody = await response.json();
  if (jsonBody.error) {
    throw new ApiError({
      status: jsonBody.status,
      message: jsonBody.error,
      errorClass: jsonBody.errorClass,
      options: jsonBody.options,
      backendStack: jsonBody.backendStack
    });
  }

  return jsonBody;
}

export default class {
  static create(path, data = {}) {
    return fetchJson(`${document.location.origin}/${path}`, {
      method: 'POST',
      headers: Object.assign(
        baseHeaders(),
        { 'Content-Type': 'application/json' }
      ),
      body: JSON.stringify(data)
    });
  }

  static update(path, data = {}) {
    return fetchJson(`${document.location.origin}/${path}`, {
      method: 'PUT',
      headers: Object.assign(
        baseHeaders(),
        { 'Content-Type': 'application/json' }
      ),
      body: JSON.stringify(data)
    });
  }

  static delete(path) {
    return fetchJson(`${document.location.origin}/${path}`, {
      method: 'DELETE',
      headers: Object.assign(
        baseHeaders(),
        { 'Content-Type': 'application/json' }
      )
    });
  }

  static async fetchFile(path) {
    const response = await fetch(path, {
      method: 'GET',
      headers: baseHeaders()
    });
    if (response.status >= 400) {
      return null;
    }
    return response.blob();
  }

  static fetch(path) {
    return fetchJson(`${document.location.origin}/${path}`, {
      method: 'GET',
      headers: baseHeaders()
    });
  }

  static fetchWithParams(path, params) {
    const query = Object.keys(params)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
    const fullPath = `${path}?${query}`;
    return this.fetch(fullPath);
  }

  static async fetchWithRetry(path, waitTime = 3000) {
    let response = await this.fetch(path);

    if (!response) {
      try {
        const delayedRequest = async () => {
          await sleep(waitTime);
          return this.fetch(path);
        };
        response = await tryPromiseUntil(delayedRequest, (result) => Boolean(result), getApiRetries());
      } catch (_err) {
        logger.error(new Error('fetchWithRetry - did not resolve.'));
        throw new ApiError({
          status: errorStatuses.FATAL,
          message: 'An unexpected API error occurred. Please contact support.'
        });
      }
    }
    return response;
  }

  static async fetchOrCreate(resource, id, data, waitTime = 3000) {
    const { jobId } = await this.create(`${resource}s`, data);

    if (jobId) {
      const job = await this.waitForJob(jobId, waitTime);
      if (jobHasFailed(job)) {
        throw new ApiError({
          status: job.status,
          message: job.error,
          errorClass: job.errorClass,
          options: job.options,
          backendStack: job.backendStack
        });
      }
    }
    return this.fetch(`${resource}s/${id}`);
  }

  static async fetchOrCreateDynamicQuote(resource, id, data, waitTime = 3000) {
    let response = await this.create(`${resource}s`, data);

    if (!response) {
      const delayedRequest = async () => {
        await sleep(waitTime);
        return this.create(`${resource}s`, data);
      };
      try {
        const quoteCreateTries = getApiRetries();
        response = await tryPromiseUntil(delayedRequest, (result) => Boolean(result), quoteCreateTries);
      } catch (err) {
        logger.error(new Error('fetchOrCreateDynamicQuote - could not create quote.'));
        throw new ApiError({
          status: errorStatuses.FATAL,
          message: 'An unexpected error occurred creating the quote. Please contact support.'
        });
      }
    }

    const { jobId } = response;

    if (jobId) {
      const job = await this.waitForJob(jobId, waitTime);
      if (jobHasFailed(job)) {
        throw new ApiError({
          status: job.status,
          message: job.error,
          errorClass: job.errorClass,
          backendStack: job.backendStack
        });
      }
    }

    return this.fetch(`${resource}s/${id}`);
  }

  static async updateWithPolling(path, data, waitTime = 3000) {
    const { jobId } = await this.update(path, data);
    const job = await this.waitForJob(jobId, waitTime);

    if (jobHasFailed(job)) {
      throw new ApiError({
        status: job.status,
        message: job.error,
        errorClass: job.errorClass,
        options: job.options,
        backendStack: job.backendStack
      });
    }

    if (jobHasMessage(job)) {
      return this.fetch(path).then((result) => {
        return {
          messages: [{ message: job.error }],
          ...result
        };
      });
    }

    return this.fetch(path);
  }

  static async saveSettingsWithPolling(path, data, previousRoofDesignId, waitTime = 3000) {
    const { jobId } = await this.update(path, data);
    const job = await this.waitForJob(jobId, waitTime);

    if (jobHasFailed(job)) {
      throw new ApiError({
        status: job.status,
        message: job.error,
        errorClass: job.errorClass,
        options: job.options,
        backendStack: job.backendStack
      });
    }

    const fullPath = `${path}?previousRoofDesignId=${previousRoofDesignId}`;

    if (jobHasMessage(job)) {
      return this.fetch(fullPath).then((result) => {
        return {
          messages: [{ message: job.error }],
          ...result
        };
      });
    }

    return this.fetch(fullPath);
  }

  static async lockQuoteWithPolling(path, data, afterPath = null, waitTime = 3000) {
    const { jobId } = await this.update(path, data);
    const job = await this.waitForJob(jobId, waitTime);
    const pathAfterCall = afterPath || path;

    if (jobHasFailed(job)) {
      // re-fetch if there was an error
      return this.fetch(pathAfterCall).then((result) => {
        return {
          error: { status: job.status, message: job.error, errorClass: job.errorClass, display: 'both' },
          ...result
        };
      });
    }

    return this.fetch(pathAfterCall);
  }

  static async preliminaryProposalWithPolling(resource, path, data, waitTime = 3000) {
    const { jobId } = await this.update(path, data);
    const job = await this.waitForJob(jobId, waitTime);

    if (jobHasFailed(job)) {
      throw new ApiError({
        status: job.status,
        message: job.error,
        errorClass: job.errorClass,
        display: 'both',
        backendStack: job.backendStack
      });
    }

    return this.fetchFile(`/quotes/${resource.sfid}/proposal`);
  }

  static async waitForJob(jobId, waitTime = 3000) {
    let job = { status: 'IN_PROGRESS' };

    while (job.status === 'IN_PROGRESS') {
      await sleep(waitTime);
      const response = await this.fetch(`jobs/${jobId}`);
      job = response.job || { status: 'COMPLETE' };
    }
    return job;
  }

  static async refreshAdobeSignWidget(quoteSfid) {
    const { jobId } = await this.create(`adobe_sign/quotes/${quoteSfid}/reinitialize_widget`);
    const job = await this.waitForJob(jobId, 2000);
    if (jobHasFailed(job)) {
      logger.warn(`Failed to reinitialize widget for "${quoteSfid}".`);
    }
    return this.fetch(`adobe_sign/quotes/${quoteSfid}`);
  }
}
