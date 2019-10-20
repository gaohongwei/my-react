import faker from "faker";
import { Factory } from "rosie";

export default function getData() {
  const personFactory = Factory.define("person")
    .attr("name", faker.name.findName)
    .attr("age", () => Math.floor(Math.random() * 100));

  const dataFactory = Factory.define("data")
    .sequence("id")
    .extend(personFactory)
    .attr("friend", () => personFactory.build());

  const data = dataFactory.buildList(10);
  return data;
}

export function getStaticData() {
  return [
    {
      id: 100,
      name: 'Justin Wei',
      age: 20,
      friend: {
        name: 'Friend1 Maurer',
        age: 23,
      }
    },
    {
      id: 200,
      name: 'Jeffrey Wei',
      age: 16,
      friend: {
        name: 'Friend2 Maurer',
        age: 23,
      }
    },
  ];
}
