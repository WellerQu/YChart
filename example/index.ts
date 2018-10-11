import render from "../src/topo";
import { TopoData } from "../typings/defines"

const update = render(document.querySelector("#app"), (userState?: any) => {
  console.log("updated successfully", userState);
});

const data: TopoData = {
  nodes:[
    {
      id: "811774388957892608",
      name: "client",
      times: 14,
      type: "SERVER",
      smallType: null,
      instances: 1,
      activeInstances: 1,
      elapsedTime: 230.9,
      rpm: 1.75,
      epm: 0.5,
      health: "INTOLERANCE",
      totalCount: 14,
      errorTotalCount: 4,
      crossApp: false
    },
    {
      id: "811774388957892608USER",
      name: "用户",
      times: 0,
      type: "USER",
      smallType: null,
      instances: 0,
      activeInstances: 0,
      elapsedTime: 0,
      rpm: 0,
      epm: 0,
      health: null,
      totalCount: 0,
      errorTotalCount: 0,
      crossApp: false
    },
    {
      id: "localhost:50051",
      name: "localhost:50051",
      times: 0,
      type: "RPC",
      smallType: null,
      instances: 0,
      activeInstances: 0,
      elapsedTime: 0,
      rpm: 0,
      epm: 0,
      health: null,
      totalCount: 0,
      errorTotalCount: 0,
      crossApp: false
    },
    {
      id: "localhost:50052",
      name: "localhost:50052",
      times: 0,
      type: "RPC",
      smallType: null,
      instances: 0,
      activeInstances: 0,
      elapsedTime: 0,
      rpm: 0,
      epm: 0,
      health: null,
      totalCount: 0,
      errorTotalCount: 0,
      crossApp: false
    },
    {
      id: "811774458356789248",
      name: "server",
      times: 4,
      type: "SERVER",
      smallType: null,
      instances: 1,
      activeInstances: 1,
      elapsedTime: 606037.75,
      rpm: 1,
      epm: 0,
      health: "NORMAL",
      totalCount: 4,
      errorTotalCount: 0,
      crossApp: false
    },
    {
      id: "811774458356789248USER",
      name: "用户",
      times: 0,
      type: "USER",
      smallType: null,
      instances: 0,
      activeInstances: 0,
      elapsedTime: 0,
      rpm: 0,
      epm: 0,
      health: null,
      totalCount: 0,
      errorTotalCount: 0,
      crossApp: false
    }
  ],
  links: [
    {
      source: "811774388957892608USER",
      target: "811774388957892608",
      elapsedTime: 235,
      rpm: 0
    },
    {
      source: "811774388957892608",
      target: "811774388957892608",
      elapsedTime: -12.5,
      rpm: 0
    },
    {
      source: "811774388957892608",
      target: "811774458356789248",
      elapsedTime: -31,
      rpm: 0
    },
    {
      source: "811774388957892608",
      target: "localhost:50051",
      elapsedTime: 16,
      rpm: 0
    },
    {
      source: "811774388957892608",
      target: "localhost:50052",
      elapsedTime: 16,
      rpm: 0
    },
    {
      source: "811774458356789248USER",
      target: "811774458356789248",
      elapsedTime: 606037.75,
      rpm: 0
    }
  ]
};

update(data);

// setInterval(() => update({a: "Redis", symbol: "redis.png"}), 3000);