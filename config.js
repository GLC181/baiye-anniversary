/* =============================================================================
 * 百业一周年 · 全站配置文件
 * -----------------------------------------------------------------------------
 * 只需要修改这个文件，就可以调整网页的文字、配色、图片、视频、动效速度和 UI 文案。
 * 素材来源：百业一周年1 文件夹（已挑选大小适合的照片与视频，复制到 assets/）。
 * 想换成自己的素材时：把文件放进 assets/images/ 或 assets/videos/，改下面的路径即可。
 * 开场视频留空时会自动回退到内置的 Canvas 动态画面。
 * ========================================================================== */

window.SITE_CONFIG = {

  /* ---------------------------- 1. 全站主题 ---------------------------- */
  theme: {
    colors: {
      deep:  '#0b0710',   // 深紫黑背景
      ocean: '#2a1b3d',   // 次背景
      aqua:  '#d9a86c',   // 暖金强调
      sand:  '#e9d8b8',
      ink:   '#f5eff7',   // 主文字
      mute:  '#a99bb5'    // 次要文字
    },
    fonts: {
      display: '"Gloock", "Songti SC", "STSong", serif',
      body:    '"Outfit", "PingFang SC", "Microsoft YaHei", sans-serif',
      mono:    '"DMMono", "SFMono-Regular", Consolas, monospace'
    },
    accent: '#d9a86c',
    grain: 0.12,
    maxWidth: 1400
  },

  /* ------------------------- 2. 开场动态影片 -------------------------- */
  intro: {
    enabled: true,
    src: 'assets/videos/intro.mp4',  // 真实开场视频（约 2MB）；留空则用 Canvas 动画
    maxPlayMs: 6000,                 // 开场视频最长播放时间，到时自动进入主页
    duration: 6500,                  // Canvas 回退模式的时长（毫秒）
    skipDelay: 900,                  // 跳过按钮延迟出现（毫秒）
    skipText: '跳过',
    hint: '正在翻开这一页',
    showOncePerSession: false
  },

  /* ------------------------- 3. 首屏主题海报 -------------------------- */
  hero: {
    eyebrow: 'ANNIVERSARY ARCHIVE · 2026',
    title: '百业一周年',
    subtitle: '把并肩走过的一程，留在这页里。',
    deepSubtitle: '这一年的光，都在这里。',
    surfaceImage: 'assets/images/hero-surface.jpg',
    underwaterImage: 'assets/images/hero-deep.jpg',
    trigger: 'hover',
    reverseOnLeave: true,
    diveDuration: 1800,
    bubbles: 40,
    scrollHint: '向下滚动 · 翻开这一页'
  },

  /* ------------------------- 4. 照片展示区 ---------------------------- */
  gallery: {
    eyebrow: '01 / GALLERY',
    title: '我们的画面',
    subtitle: '一帧一帧，都是一起走过的证明。',
    rowDuration: [58, 72],
    cardWidth: 300,
    pauseOnHover: true,
    focusBlur: 12,
    flipDuration: 820,
    closeText: '退出展示',
    flipHint: '再次点击照片 · 翻到背面读一段回忆',
    backHint: '再点一次 · 回到画面',
    items: [
      {
        image: 'assets/images/gallery-01.jpg',
        tag: '01 / 纯白花开',
        title: '月下同行',
        text: '夜色把两个人的影子拉得很长。月下并肩，连风都放轻了脚步。'
      },
      {
        image: 'assets/images/gallery-02.jpg',
        tag: '02 / 纯白花开',
        title: '初夏荷风',
        text: '荷叶铺开一整个夏天，而你恰好站在光里，回头看了我们一眼。'
      },
      {
        image: 'assets/images/gallery-03.jpg',
        tag: '03 / 纯白花开',
        title: '热烈如初',
        text: '那一抹红，热烈得像不曾褪色的黄昏，也像我们第一次见面时的心情。'
      },
      {
        image: 'assets/images/gallery-04.jpg',
        tag: '04 / 纯白花开',
        title: '湖心小舟',
        text: '水波不急，船也不急。我们把时间停在船头，谁都没有先开口。'
      },
      {
        image: 'assets/images/gallery-05.jpg',
        tag: '05 / 坂田银莳',
        title: '并肩的人',
        text: '有人站在光里，有人站在身后。这一年，幸好两侧都有人。'
      },
      {
        image: 'assets/images/gallery-06.jpg',
        tag: '06 / 燕云',
        title: '灯下归人',
        text: '一盏灯，一条旧街，一个恰好的回头。江湖再大，也大不过这方灯火。'
      },
      {
        image: 'assets/images/gallery-07.png',
        tag: '07 / 沉沰',
        title: '夜色独白',
        text: '安静的角落里，也藏着一整年的故事。不说，不代表忘记。'
      },
      {
        image: 'assets/images/gallery-08.jpg',
        tag: '08 / 燕云',
        title: '花间一瞬',
        text: '花瓣落下的速度，刚好够我们把这一年，牢牢记住。'
      }
    ]
  },

  /* ------------------------- 5. 视频展示区 ---------------------------- */
  video: {
    eyebrow: '02 / MOTION',
    title: '流动的一年',
    description: '有些瞬间，只有影像留得住。',
    // 视频列表：点击下方缩略图即可切换；src 为视频，poster 为缩略图
    items: [
      { src: 'assets/videos/show-1.mp4', poster: 'assets/images/thumb-1.jpg', title: '水墨群像', tag: '遙渊' },
      { src: 'assets/videos/show-2.mp4', poster: 'assets/images/thumb-2.jpg', title: '花间一瞬', tag: '燕云' },
      { src: 'assets/videos/show-3.mp4', poster: 'assets/images/thumb-3.jpg', title: '红衣如焰', tag: '东方明' },
      { src: 'assets/videos/show-4.mp4', poster: 'assets/images/thumb-4.jpg', title: '夜泊江湖', tag: '鹤云沁' },
      { src: 'assets/videos/show-5.mp4', poster: 'assets/images/thumb-5.jpg', title: '镜中人', tag: '清风曳影' },
      { src: 'assets/videos/show-6.mp4', poster: 'assets/images/thumb-6.jpg', title: '冰蓝回响', tag: '玉龙象' }
    ],
    pickerLabel: '选择影像',
    pickerHint: '点击缩略图切换',
    videoRatio: 80,
    loopSeconds: 24,                          // Canvas 回退模式的循环时长
    volume: 0.35,
    ambientSound: true,
    playText: '播放',
    pauseText: '暂停',
    volumeText: '音量'
  },

  /* ------------------------- 6. 弹幕留言墙 ---------------------------- */
  danmaku: {
    eyebrow: '03 / VOICES',
    title: '留下的话',
    subtitle: '把祝福交给风，它会吹到每个人那里。',
    lanes: 5,
    spawnInterval: [900, 1800],
    duration: [11000, 19000],
    sizeRange: [14, 34],
    opacityRange: [0.42, 1],
    styleCycle: ['solid', 'outline', 'glass', 'glow'],
    colors: ['#f5eff7', '#d9a86c', '#e9d8b8', '#c9a6ff', '#e6cfae'],
    allowInput: true,
    inputPlaceholder: '写一句祝福，交给风…',
    inputButtonText: '寄出',
    messages: [
      '百业一周年，生日快乐！',
      '这一年辛苦了，下一程继续同行。',
      '认识你们真好。',
      '江湖路远，我们还在。',
      '愿每次上线都有人等你。',
      '一周年，只是开始。',
      '把酒言欢，来日方长。',
      '感谢相遇，不负遇见。',
      '照片里的每个人都很闪亮。',
      '明年今日，还要一起。',
      '这一页，值得被记住。',
      '愿百业长青，故人不散。'
    ]
  },

  /* ------------------------- 7. 联系方式 ------------------------------ */
  contact: {
    eyebrow: '04 / CONTACT',
    title: '写一封回信',
    description: '若有想说的话，寄到这片江湖的尽头。',
    email: '2899353374@qq.com',
    buttonText: '打开邮箱',
    footer: '© 2026 百业一周年 · 把并肩走过的一程留在这里'
  },

  /* ------------------------- 8. 转场与细节 ---------------------------- */
  motion: {
    sectionDuration: 900,
    sectionEase: 'cubic-bezier(0.16, 1, 0.3, 1)',
    scrollProgress: true,
    waveDivider: true,
    respectReducedMotion: true
  }
};
