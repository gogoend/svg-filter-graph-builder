<template>
  <div
    class="about-content"
  >
    <p>
      SVG Filter Node Builder v{{ packageInfo.version }}
      <br />
      ©️2021-2022
      <a target="_blank" href="https://github.com/gogoend">gogoend</a>
    </p>

    <p>
      The project is inspired by the following project:
    </p>
    <ul>
      <li>
        <a target="_blank" href="https://github.com/poletaevvlad/svg-filter-editor">poletaevvlad / svg-filter-editor</a>
      </li>
      <li>
        <a target="_blank" href="https://github.com/yoksel/svg-filters">yoksel / svg-filters</a>
      </li>
    </ul>

    <p>
      The program includes some source code from the following open source projects:
    </p>
    <ul>
      <li>
        <a target="_blank" href="https://github.com/vuejs/core">vuejs / core</a>
      </li>
      <li>
        <a target="_blank" href="https://github.com/element-plus/element-plus">dexie / Dexie.js</a>
      </li>
      <li>
        <a target="_blank" href="https://github.com/yued-fe/lulu">yued-fe / lulu</a>
      </li>
      <li>
        <a target="_blank" href="https://github.com/element-plus/element-plus">element-plus / element-plus</a>
      </li>
      <li>
        <a target="_blank" href="https://github.com/tsayen/dom-to-image">tsayen / dom-to-image</a>
      </li>
    </ul>

    <p>
      The sample image is downloaded from the website of <a target="_blank" href="https://peach.blender.org/media-gallery/"><i>Big Buck Bunny</i></a>
      - a movie is totally made with open source digital content creators.
    </p>

    <p>
      Thanks to my employer,
      <a target="_blank" href="https://www.aicloud.com/">Beijing SinoVoice Technology Co.,Ltd.</a>
      (aka. <a target="_blank" href="https://www.aicloud.com/">北京捷通华声科技股份有限公司</a> in Chinese),
      which gives me a WLB life style to let me do my hobby after work.
    </p>
  </div>
</template>

<script lang="ts" setup>
import packageInfo from '../../../package.json'
</script>
<style lang="scss" scoped>

</style>
