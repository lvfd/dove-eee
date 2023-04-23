exports.dataServer = 'http://lyu.dp.com:8080'
exports.nodeServer = 'http://lyu.dp.com:3000'
exports.redisCluster = {
  rootNodes: 
    process.env.NODE_ENV === 'development'? 
    [
      { host: '10.1.85.160', port: 7000 },
      { host: '10.1.85.160', port: 7001 },
      { host: '10.1.85.160', port: 7002 },
      { host: '10.1.85.160', port: 7003 },
      { host: '10.1.85.160', port: 7004 },
      { host: '10.1.85.160', port: 7005 }
    ]
    :
    [
      { host: '10.1.85.160', port: 7000 },
      { host: '10.1.85.160', port: 7001 },
      { host: '10.1.85.160', port: 7002 },
      { host: '10.1.85.160', port: 7003 },
      { host: '10.1.85.160', port: 7004 },
      { host: '10.1.85.160', port: 7005 }
    ],
    /* 
    [
      { host: '10.1.82.105', port: 7000 },
      { host: '10.1.82.105', port: 7001 },
      { host: '10.1.82.106', port: 7000 },
      { host: '10.1.82.106', port: 7001 },
      { host: '10.1.82.107', port: 7000 },
      { host: '10.1.82.107', port: 7001 }
    ],
    */
  password: 'Acca@1234'
}