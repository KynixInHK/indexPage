<script setup>
  // 导包
  import { ref, reactive, onMounted } from 'vue'
  import { getCurrentInstance } from 'vue'

  // 系统变量
  const { proxy } = getCurrentInstance()

  // 普通变量
  let time = ref('')
  let bgc = ref('#fff')
  let color = ref('')
  let color_box = ref('')
  let color_sel = ref('')
  let sunMoon = ref('')
  let hello = ref('')
  let engine = ref('google')
  let weather = reactive({
    icon: '',
    weather: '',
    temperature: '',
    city: ''
  })
  let engines = reactive([
    { engine: 'google', img: '/src/assets/google.png', backgc: '' },
    { engine: 'baidu', img: '/src/assets/baidu.png', backgc: '' },
    { engine: 'bing', img: '/src/assets/bing.png', backgc: '' }
  ])
  let suggestions = ref([])
  let value = ref('')
  let origin_value = ref('')
  let cpLock = ref(true)
  let selIndex = ref(-1)
  let noHide = ref(false)
  let apps = reactive([
    { id: 1, name: 'Kynix', href: 'https://www.kynix.cc/', icon: '/src/assets/apps/finder.png' },
    { id: 2, name: 'bilibili', href: 'https://www.bilibili.com/', icon: '/src/assets/apps/bilibili.png' },
    { id: 3, name: 'icourse', href: 'https://www.icourse163.org/', icon: '/src/assets/apps/mooc.png' },
    { id: 4, name: 'netdisk', href: 'https://pan.baidu.com/', icon: '/src/assets/apps/pan.png' },
    { id: 5, name: 'SDUUS', href: 'https://www.bkjx.sdu.edu.cn/', icon: '/src/assets/apps/sduus.png' },
    { id: 6, name: 'JD', href: 'https://www.jd.com/', icon: '/src/assets/apps/jd.png' },
    { id: 7, name: 'Google Translation', href: 'https://translate.google.com/', icon: '/src/assets/apps/trans.png' },
    { id: 8, name: 'CSDN', href: 'https://blog.csdn.net/', icon: '/src/assets/apps/csdn.png' },
    { id: 9, name: 'GitHub', href: 'https://github.com/', icon: '/src/assets/apps/github.png' }
  ])
  let selApp = ref(-1)
  let noHideApps = ref(false)

  // 自定义方法
  const getTime = (timestamp) => {
    let date = new Date(timestamp)
    let hour = date.getHours()
    return hour
  }
  const setBgc = (e) => {
    localStorage.setItem('engine', e.target.dataset.name)
    engine.value = e.target.dataset.name
    for(var i = 0;i < engines.length; i ++) {
      engines[i].backgc = ''
    }
    switch(e.target.dataset.name) {
      case 'google': engines[0].backgc = time.value === 'day' ? '#aaa' : '#281e41'; break
      case 'baidu': engines[1].backgc = time.value === 'day' ? '#aaa' : '#281e41'; break
      case 'bing': engines[2].backgc = time.value === 'day' ? '#aaa' : '#281e41'; break
    }
    let selectedEngine = document.getElementById(e.target.dataset.id)
    selectedEngine.style.animation = 'zoom 0.3s ease'
    selectedEngine.style.webkitAnimation = 'zoom 0.3s ease'
    selectedEngine.addEventListener('animationend', () => {
      selectedEngine.style.animation = ''
      selectedEngine.style.webkitAnimation = ''
    })
  }
  const goToWebSite = (e) => {
    switch (e.target.dataset.name) {
      case 'google' : window.open('https://www.google.com/'); break
      case 'baidu': window.open('https://www.baidu.com/'); break
      case 'bing': window.open('https://www.bing.com/'); break
    }
  }
  const readyToSearch = () => {
    let search = document.getElementById('search')
    let avatar = document.getElementsByClassName('automn')
    search.style.boxShadow = '0.3rem 0.3rem 0.7rem #888'
    search.style.width = '90vw'
    search.style.height = '5rem'
    search.style.fontSize = '2em'
    avatar[0].style.transform = 'translateY(-165%)'
    avatar[0].style.width = '10rem'
    if(suggestions.value.length !== 0) {
      noHide.value = true
    } else {
      noHide.value = false
    }
    noHideApps.value = true
  }
  const recovery = () => {
    let search = document.getElementById('search')
    let avatar = document.getElementsByClassName('automn')
    search.style.boxShadow = '0.3rem 0.3rem 0.3rem #888'
    search.style.width = '40rem'
    search.style.height = '10rem'
    search.style.fontSize = '4em'
    avatar[0].style.transform = 'translateY(-50%)'
    avatar[0].style.width = '30rem'
    noHide.value = false
    noHideApps.value = false
  }

  const input = (e) => {
    if(cpLock.value === true) {
      origin_value.value = value.value
      proxy.$http.get('/sug/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + value.value + '&json=1&cb=callback')
      .then((res) => {
        let callback = res.data
        let splited = callback.split('"s":')[1].split('\"')
        let count = 0
        suggestions.value = []
        for(var i = 0; i < splited.length; i ++) {
          if(i % 2 !== 0) {
            let hope = { id: count, data: splited[i] }
            suggestions.value[count] = hope
            count ++
          }
        }
        if(suggestions.value.length !== 0) {
          noHide.value = true
        } else {
          noHide.value = false
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  const startType = () => {
    cpLock.value = false
  }
  const endType = (e) => {
    cpLock.value = true
    input(e)
  }

  const select = (index) => {
    selIndex.value = index
    if(index === 0) {
      let sug_0 = document.getElementById('sug0')
      sug_0.style.borderTopLeftRadius = '1rem'
      sug_0.style.borderTopRightRadius = '1rem'
    }
    else if(index === suggestions.value.length - 1) {
      let sug_last = document.getElementById('sug' + index)
      sug_last.style.borderBottomLeftRadius = '1rem'
      sug_last.style.borderBottomRightRadius = '1rem'
    }
  }

  const selectBack = () => {
    selIndex.value = -1
  }

  const changeSelAndSubmit = (e) => {
    if(e.keyCode === 40) { //按键盘下键
      if(selIndex.value !== suggestions.value.length - 1) {
        selIndex.value ++
        value.value = suggestions.value[selIndex.value].data
      } else {
        selIndex.value = -1
        value.value = origin_value.value
      }

      if(selIndex.value === 0) {
        let sug_0 = document.getElementById('sug0')
        sug_0.style.borderTopLeftRadius = '1rem'
        sug_0.style.borderTopRightRadius = '1rem'
      } else if(selIndex.value === suggestions.value.length - 1) {
        let sug_last = document.getElementById('sug' + selIndex.value)
        sug_last.style.borderBottomLeftRadius = '1rem'
        sug_last.style.borderBottomRightRadius = '1rem'
      }

    } else if(e.keyCode === 38) { //按键盘上键
      if(selIndex.value !== -1) {
        selIndex.value --
        if(selIndex.value !== -1) {
          value.value = suggestions.value[selIndex.value].data
        } else {
          value.value = origin_value.value
        }
      } else {
        selIndex.value = suggestions.value.length - 1
        value.value = suggestions.value[selIndex.value].data
      }

      if(selIndex.value === 0) {
        let sug_0 = document.getElementById('sug0')
        sug_0.style.borderTopLeftRadius = '1rem'
        sug_0.style.borderTopRightRadius = '1rem'
      } else if(selIndex.value === suggestions.value.length - 1) {
        let sug_last = document.getElementById('sug' + selIndex.value)
        sug_last.style.borderBottomLeftRadius = '1rem'
        sug_last.style.borderBottomRightRadius = '1rem'
      }
    } else if(e.keyCode === 13 || e.keyCode === 108) { // 按下enter键
      let engine = localStorage.getItem('engine')
      let url = ''
      switch(engine) {
        case 'google': url = 'https://www.google.com/search?q=' + value.value; break
        case 'baidu': url = 'https://www.baidu.com/s?wd=' + value.value; break
        case 'bing': url= 'https://www.bing.com/search?q=' + value.value; break
      }
      window.open(url) // 使用对应引擎进行搜索
      value.value = ''
      origin_value.value = ''
      selIndex.value = -1
      suggestions.value = []
      noHide.value = false
    } else {
      selIndex.value = -1
    }

  }
  const search = (e) => {
    // console.log(e.target.dataset.value)
    let searchThing = e.target.dataset.value
    let engine = localStorage.getItem('engine')
    let url = ''
    switch(engine) {
      case 'google': url = 'https://www.google.com/search?q=' + searchThing; break
      case 'baidu': url = 'https://www.baidu.com/s?wd=' + searchThing; break
      case 'bing': url= 'https://www.bing.com/search?q=' + searchThing; break
    }
    window.open(url) // 使用对应引擎进行搜索
    value.value = ''
    origin_value.value = ''
    selIndex.value = -1
    suggestions.value = []
    noHide.value = false
  }

  const zoomit = (index) => {
    selApp.value = index
  }
  const recoveryit = () => {
    selApp.value = -1
  }
  const doingit = (e) => {
    let index = parseInt(e.target.dataset.id)
    let url = apps[index].href
    window.open(url)
    value.value = ''
    origin_value.value = ''
    selIndex.value = -1
    suggestions.value = []
    noHide.value = false
  }

  // 生命周期函数
  onMounted(() => {
    // 读取引擎
    localStorage.getItem('engine') ? engine.value = localStorage.getItem('engine') : localStorage.setItem('engine', 'google')

    // 获取时间
    proxy.$http.get('/time/api/ct.do')
    .then((res) => {
      let hour = getTime(res.data.currentTime)
      if(hour >= 19 || hour < 7) { // 暗色系
        time.value = 'night'
        bgc.value = '#140a2d'
        sunMoon.value = '/src/assets/moon.png'
        color.value = '#9288ab'
        color_box.value = '#281e41'
        color_sel.value = '#ececec'

        // 选择引擎
        let engine = localStorage.getItem('engine')
        switch(engine) {
          case 'google': engines[0].backgc = '#281e41'; break
          case 'baidu': engines[1].backgc = '#281e41'; break
          case 'bing': engines[2].backgc = '#281e41'; break
        }
      } else { // 亮色系
        time.value = 'day'
        bgc.value = '#fdffbf'
        sunMoon.value = '/src/assets/sun.png'
        color.value = '#000'
        color_box.value = '#fff'
        color_sel.value = '#ececec'

        // 选择引擎
        let engine = localStorage.getItem('engine')
        switch(engine) {
          case 'google': engines[0].backgc = '#aaa'; break
          case 'baidu': engines[1].backgc = '#aaa'; break
          case 'bing': engines[2].backgc = '#aaa'; break
        }
      }
      if(hour >= 4 && hour <= 12) {
        hello.value = 'Good morning, have a nice day! 😀'
      } else if(hour > 12 && hour <19) {
        hello.value = 'Good afternoon, enjoy yourself. 🍵'
      } else if(hour >= 19 && hour <= 22) {
        hello.value = 'Good evening, today must be a beautiful day. ❤️'
      } else {
        hello.value = 'It is too late, have a early rest. 🌙'
      }
    })
    .catch((err) => {
      console.log(err)
    })

    // 获取天气
    /* 通过IP获取location */
    proxy.$http.get('/loc/ws/location/v1/ip?key=WV7BZ-RY66X-GDH4K-T653N-QR64F-S4BL4')
    .then((res) => {
      let location = res.data.result.ad_info.city
      weather.city = location
      /* 通过location获取locationID */
      proxy.$http.get('/weather/v2/city/lookup?key=19deeb7ee6e84dfaa8581df334b96328&location=' + location)
      .then((res) => {
        let locationID = res.data.location[0].id
        /* 通过locationID获取weather */
        proxy.$http.get('/wea/v7/weather/now?key=19deeb7ee6e84dfaa8581df334b96328&location=' + locationID)
        .then((res) => {
          weather.icon = '/src/assets/weather/' + res.data.now.icon + '.svg'
          weather.weather = res.data.now.text
          weather.temperature = res.data.now.temp + ' ℃'
        })
        .catch((err) => {
          console.log(err)
        })
      })
      .catch((err) => {
        console.log(err)
      })
    })
    .catch((err) => {
      console.log(err)
    })
  })
</script>

<template>
  <div id="root" :style="{ backgroundColor: bgc, color: color }">
    <div class="title">The Start Page For Kynix</div>
    <div class="moonAndSun">
      <img :src="sunMoon" class="sunMoon">
    </div>
    <div class="location">
      <img src="./assets/location.svg" :style="{ filter: 'drop-shadow(' + color + ' -100rem 0)' }">
      <div class="city">{{weather.city}}</div>
    </div>
    <div class="weather">
      <img :src="weather.icon" :style="{ filter: 'drop-shadow(' + color + ' -100rem 0)' }">
      <div class="weatherAndTemp">
        <div>{{weather.weather}}</div>
        <div>{{weather.temperature}}</div>
      </div>
    </div>
    <div class="hello">{{hello}}</div>
    <img src="./assets/automn.png" class="automn">
    <div class="selectEngine">
      <img :src="item.img" class="engine" v-for="(item, index) in engines" :style="{ backgroundColor: item.backgc }" @click="setBgc" @dblclick="goToWebSite" :data-name="item.engine" :id="index" :data-id="index">
    </div>
    <div class="searchBox">
      <input type="text" v-model="value" id="search" :style="{ backgroundColor: color_box, color: color }" placeholder="Type to search..." @focus="readyToSearch" @blur="recovery" @input="input" @compositionstart="startType" @compositionend="endType" @keyup="changeSelAndSubmit">
      <Transition name="fade">
        <div class="sugs" :style="{ backgroundColor: color_box }" v-if="noHide">
          <div class="sug" v-for="(item, index) in suggestions" :key="item.id" :id="'sug' + index" :class="[index === selIndex ? { sugActive : true } : { sugActive : false }]" @mouseenter="select(index)" @mouseleave="selectBack" @click="search" :data-value="item.data">{{item.data}}</div>
        </div>
      </Transition>
    </div>
    <Transition name="slide">
      <div class="apps" v-if="noHideApps" :style="{ backgroundColor: color_box }">
      <div class="app" v-for="(item, index) in apps" :data-id="index" @mousemove="zoomit(index)" @mouseleave="recoveryit" @click="doingit">
        <img :src="item.icon" :class="[index === selApp ? { appActive : true } : { appActive : false }]" :data-id="index">
        <div class="appTitle" :data-id="index" :style="{ color: color }">{{item.name}}</div>
      </div>
    </div>
    </Transition>
  </div>
</template>

<style>

  /* 导入字体 */
  @import './assets/fonts/font.css';
  * {
    margin: 0;
    padding: 0;
  }
  #app {
    max-width: 0;
    margin: 0 0;
    padding: 0;
    text-align: left;
  }
  #root {
    width: 100vw;
    height: 100vh;
  }
  .moonAndSun {
    position: fixed;
    left: 2rem;
    top: 3rem;
  }
  .sunMoon {
    width: 5rem;
  }
  .title {
    font-family: 'jianzhi';
    font-size: 4em;
    position: fixed;
    z-index: 1;
    right: 5rem;
    top: 5rem;
  }
  .hello {
    font-family: 'jiansong';
    font-weight: 400;
    font-size: 1.5em;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 2rem;
  }
  .automn {
    width: 30rem;
    border-radius: 15.5rem;
    position: fixed;
    z-index: 0;
    left: 8rem;
    top: 50%;
    transform: translateY(-50%);
    border-color: white;
    border-style: solid;
    border-width: 1rem;
    transition: all 1s ease;
  }
  input {
    width: 40rem;
    height: 10rem;
    border: none;
    border-radius: 5rem;
    text-align: center;
    font-size: 4em;
    font-family: 'jiansong';
    position: fixed;
    right: 5rem;
    top: 50%;
    transform: translateY(-50%);
    outline: none;
    box-shadow: 0.3rem 0.3rem 0.3rem #888;
    transition: all 1s ease;
  }
  input:hover {
    box-shadow: 0.3rem 0.3rem 0.7rem #888;
  }
  .selectEngine {
    position: fixed;
    right: 14.5rem;
    top: 30%;
  }
  .engine {
    width: 3rem;
    margin-right: 2rem;
    padding: 1rem;
    border-radius: 2.5rem;
    cursor: pointer;
  }
  .weather {
    position: fixed;
    right: 9rem;
    top: 9rem;
  }
  .weather img {
    position: relative;
    left: 100rem;
    width: 5rem;
  }
  .weatherAndTemp {
    display: inline-block;
    font-size: 1.5em;
    position: relative;
    top: -1.1rem;
    left: 1rem;
    line-height: 1.2em;
    font-family: 'heiti';
  }
  .location {
    position: fixed;
    right: 22rem;
    top: 9.5rem;
  }
  .location img {
    position: relative;
    left: 100rem;
    width: 3rem;
  }
  .city {
    font-size: 3rem;
    display: inline-block;
    position: relative;
    top: -1rem;
    left: 2rem;
    font-family: 'jianzhi';
  }
  .sugs {
    width: 30rem;
    text-align: center;
    display: inline-block;
    position: fixed;
    top: 57%;
    left: 10rem;
    border-radius: 1rem;
    box-shadow: 0.3rem 0.3rem 0.3rem #888;
  }
  .sug {
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    cursor: pointer;
  }
  .sugActive {
    background-color: #ebebeb;
    font-weight: bold;
  }
  .apps {
    width: 30rem;
    height: 21rem;
    display: grid;
    grid-template-columns: 10rem 10rem 10rem;
    grid-template-rows: 7rem 7rem 7rem;
    justify-content: center;
    align-items: center;
    border-radius: 2rem;
    box-shadow: 0.3rem 0.3rem 0.3rem #888;
    position: fixed;
    right: 10rem;
    bottom: 4rem;
  }
  .app {
    text-align: center;
    cursor: pointer;
  }
  .app img {
    width: 4rem;
    border-radius: 0.7rem;
    box-shadow: 0.3rem 0.3rem 0.3rem #888;
  }

  .appActive {
    transform: scale(110%);
    transition: all 0.4s ease;
  }

  @keyframes zoom {
    0% {
      transform: scale(100%);
    }
    50% {
      transform: scale(80%);
    }
    100% {
      transform: scale(100%);
    }
  }
  @-webkit-keyframes zoom {
    0% {
      transform: scale(100%);
    }
    50% {
      transform: scale(80%);
    }
    100% {
      transform: scale(100%);
    }
  }
  .fade-enter-active {
    transition: opacity 0.5s ease 0.5s;
  }
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-enter-active {
    transition: all 1s ease;
  }
  .slide-leave-active {
    transition: all 0.5s ease;
  }
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(50rem);
  }
</style>
