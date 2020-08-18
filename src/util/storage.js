// 对复杂数据存储进行封装
/**
 * 获取当前存储类型对象
 * @param {*} type
 */
function getStorage(type) {
  switch (type) {
    case 'local':
      return localStorage;
    case 'session':
      return sessionStorage;
    default:
      return sessionStorage;
  }
}

export default {

  /* 数据存储
   * @param { String } key
   * @param { Object } value
   * @param { Object } type 数据扩展标识
   */
  setItem(key, value, type = 'local') {
    // key必须为字符串
    if (!key || typeof key !== 'string') {
      console.log('参数 key 错误.');
      return
    }

    // 统一将数据转换为json格式进行存储
    let data;
    if (value === undefined) {
      data = JSON.stringify()
    } else if (typeof value === 'object') {
      data = JSON.stringify(value)
    } else {
      data = value
    }

    getStorage(type).setItem(key, data)

  },
  /**
   * 获取存储数据
   * @param {Object} key
   */
  getItem: function (key, type = 'local') {
    if (!key || typeof key !== 'string') {
      console.log('参数 key 错误.')
      return
    }

     // 数据转换为json格式进行存储
    let data = getStorage(type).getItem(key)
    try {
      if (data !== '' && data !== undefined) {
        return JSON.parse(data);
      } else {
        return '';
      }
    } catch (ex) {
      console.warn("转换JSON失败。key:",key)
      return data;
    }
  },

  /**
   * 删除数据对象
   * @param {Object} key
   */
  removeItem: function (key, type = 'local') {
    let storage = getStorage(type)
    storage.removeItem(key)
  },

  type: {
    local: 'local',
    session: 'session'
  }
}
