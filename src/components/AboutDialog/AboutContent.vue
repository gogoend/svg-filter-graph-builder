<template>
  <div
    class="about-content"
  >
    <h2>SVG Filter Node Builder v{{ appInfo.version }}</h2>
    <p>
      ©️2021-2022
      <a target="_blank"
         href="https://github.com/gogoend">gogoend</a>
      <br />
      Build Time: {{ new Date(appInfo.buildTime) }}
      <br />
      Git Commit: {{ appInfo.buildHash }}
      <br />
      Build Version: {{ appInfo.buildVersion }}
    </p>
    <div class="about-content__hr" />
    <div class="about-content__append">
      <p>
        The project is inspired by the following project:
      </p>
      <ul>
        <li>
          <a target="_blank"
             href="https://github.com/poletaevvlad/svg-filter-editor">poletaevvlad / svg-filter-editor</a>
        </li>
        <li>
          <a target="_blank"
             href="https://github.com/yoksel/svg-filters">yoksel / svg-filters</a>
        </li>
      </ul>

      <p>
        The program includes some source code from the following open source projects:
      </p>
      <ul>
        <li>
          <a target="_blank"
             href="https://github.com/vuejs/core">vuejs / core</a>
        </li>
        <li>
          <a target="_blank"
             href="https://github.com/element-plus/element-plus">dexie / Dexie.js</a>
        </li>
        <li>
          <a target="_blank"
             href="https://github.com/yued-fe/lulu">yued-fe / lulu</a>
        </li>
        <li>
          <a target="_blank"
             href="https://github.com/element-plus/element-plus">element-plus / element-plus</a>
        </li>
        <li>
          <a target="_blank"
             href="https://github.com/tsayen/dom-to-image">tsayen / dom-to-image</a>
        </li>
      </ul>

      <p>
        The sample image is downloaded from the website of <a target="_blank"
                                                              href="https://peach.blender.org/media-gallery/"><i>Big Buck Bunny</i></a>
        - a movie is totally made with open source digital content creators.
      </p>

      <p>
        Thanks to my employer,
        <a target="_blank"
           href="https://www.aicloud.com/">Beijing SinoVoice Technology Co.,Ltd.</a>
        (aka. <a target="_blank"
                 href="https://www.aicloud.com/">北京捷通华声科技股份有限公司</a> in Chinese),
        which gives me a WLB life style to let me do my hobby after work.
      </p>

      <details>
        <summary>LICENSE</summary>
        <pre>
MIT License

Copyright (c) 2021 gogoend

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</pre>

      </details>

    </div>
  </div>
</template>

<script lang="ts" setup>
const appInfo = window.__sfgb_runtime_config__
</script>
<style lang="scss" scoped>
.about-content__hr {
  margin: 0.5em 0;
  border: 0;
  height: 1px;
  background-color: #666;
}
.about-content__append {
  overflow-y: auto;
  font-size: 12px;
  height: 330px;
}
</style>
