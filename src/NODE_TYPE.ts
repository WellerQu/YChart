export enum NODE_TYPE {
  LINE = 'line',
  NODE = 'node',
  USER = 'USER',
  SERVER = 'SERVER',
  DATABASE = 'DATABASE',
  NOSQL = 'NOSQL',
  HTTP = 'HTTP',
  RPC = 'RPC',
  MQ = 'MQ',
}

export enum DATABASE_TYPE {
  KAFKA_PRODUCER = 'kafkaProducer',
  KAFKA_CONSUMER = 'kafkaConsumer',
  REDIS = 'redis',
  MYSQL = 'mysql',
}