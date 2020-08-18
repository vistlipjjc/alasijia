export default {
    name: '信息服务平台',
    version: '6.0.0',
    url: {
      server: '/api/'
      // server: 'http://47.101.197.164:805/api/' // 内部阿里云测试环境
      // server: 'http://192.168.0.79:81/api/' // 行方阿里云测试环境
      // server: 'http://120.79.177.227:81/api/' // 阿里云生产环境
      // server: 'http://192.168.1.113:9003/api/'
    },
    net: {
        type: 'GET'
    },
    debug: true,
    services: {
      default: 'sys',
      system: 'sys',
      schedule: 'sch',
      rule: 'rule',
      wf: 'wf',
      backend: 'backend'
    }
};
