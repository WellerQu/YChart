import render from '../src/topo'
import { TopoData } from '../typings/defines'

const update = render(document.querySelector('#app'), (userState?: any) => {
  console.log('updated successfully', userState)
})

const data: TopoData = {
  'nodes': [
    {
      'id': '811774388957892608',
      'name': 'client',
      'times': 51,
      'type': 'SERVER',
      'smallType': null,
      'instances': 1,
      'activeInstances': 1,
      'elapsedTime': 6702.81,
      'rpm': 1.24,
      'epm': 0.1,
      'health': 'INTOLERANCE',
      'totalCount': 51,
      'errorTotalCount': 4,
      'crossApp': false
    },
    {
      'id': '811774388957892608USER',
      'name': '用户',
      'times': 0,
      'type': 'USER',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'localhost:8980',
      'name': 'localhost:8980',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'localhost:50051',
      'name': 'localhost:50051',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '811774458356789248',
      'name': 'server',
      'times': 60,
      'type': 'SERVER',
      'smallType': null,
      'instances': 1,
      'activeInstances': 1,
      'elapsedTime': 41546.78,
      'rpm': 1.67,
      'epm': 0,
      'health': 'HEALTHY',
      'totalCount': 60,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '811774458356789248USER',
      'name': '用户',
      'times': 0,
      'type': 'USER',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    }
  ],
  'links': [
    {
      'source': '811774388957892608USER',
      'target': '811774388957892608',
      'elapsedTime': 6708.11,
      'rpm': 0
    },
    {
      'source': '811774388957892608',
      'target': '811774458356789248',
      'elapsedTime': 0.91,
      'rpm': 0
    },
    {
      'source': '811774388957892608',
      'target': '811774388957892608',
      'elapsedTime': -12.5,
      'rpm': 0
    },
    {
      'source': '811774388957892608',
      'target': 'localhost:8980',
      'elapsedTime': 7,
      'rpm': 0
    },
    {
      'source': '811774388957892608',
      'target': 'localhost:50051',
      'elapsedTime': 16,
      'rpm': 0
    },
    {
      'source': '811774458356789248USER',
      'target': '811774458356789248',
      'elapsedTime': 41546.78,
      'rpm': 0
    }
  ]
}


update(data)

// setInterval(() => update({a: "Redis", symbol: "redis.png"}), 3000);
