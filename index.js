function appStart () {
  let fpsDiv = document.getElementById('fps')
  let fps = Number(fpsDiv.textContent)

  function moreFps () {
    if (fps < 24) {
      fps += 1
      fpsDiv.textContent = fps
    }
  }

  function lessFps () {
    if (fps > 1) {
      fps -= 1
      fpsDiv.textContent = fps
    }
  }

  const less = document.getElementById('less')
  less.addEventListener('click', lessFps)

  const more = document.getElementById('more')
  more.addEventListener('click', moreFps)

  // canvas drawing

  let curFrame = document.getElementById('frame')

  const frames = [] // all frames

  let frame = [] // current frame

  function getDivColor () { // define color and form for each figure on the main panel
    let copy = frame.slice()
    copy.length = 0
    for (let i = 1; i < 10; i += 1) {
      const arr = []
      let fig1 = document.getElementById(i)
      // eslint-disable-next-line no-undef
      let color = getComputedStyle(fig1).backgroundColor
      arr.push(color)
      if (fig1.classList.contains('circle')) {
        arr.push(true)
      }

      copy.push(arr)
      frame = copy.slice()
    }
  }

  getDivColor()

  function drawFrame () {
    var canvasFrame = document.getElementsByClassName('frame current')[0].children[1] // define canvas in the current frame
    var ctf = canvasFrame.getContext('2d')
    ctf.clearRect(0, 0, 140, 140)

    let count = 0
    for (let i = 0; i <= 100; i += 50) {
      for (let j = 0; j <= 100; j += 50) {
        ctf.fillStyle = frame[count][0] /* take color */
        if (frame[count][1]) { /* define form */
          ctf.beginPath()
          ctf.arc(j + 20, i + 20, 20, 0, 2 * Math.PI)
          ctf.fill()
        } else {
          ctf.fillRect(j, i, 40, 40)
        }
        count += 1
      }
    }
  }
  drawFrame()

  // Add new frame //

  const addBtn = document.getElementById('add-frame')
  addBtn.addEventListener('click', addFrame)

  let numb = 1

  function addFrame (event) {
    event.stopPropagation()
    let copy = frame.slice()
    frames.push(copy) // add last frame to the frames array
    animation()
    const div = document.createElement('div')
    curFrame.classList.toggle('current')
    div.className = 'frame current'
    document.getElementById('frames').insertBefore(div, addBtn) // add new frame before button
    curFrame = div

    const btn = document.createElement('input')
    btn.setAttribute('type', 'button')
    btn.setAttribute('id', 'delete')
    btn.setAttribute('value', 'x')
    btn.className = 'delete'
    curFrame.appendChild(btn)

    const canv = document.createElement('canvas')
    canv.setAttribute('id', 'frame-item')
    canv.setAttribute('width', '140')
    canv.setAttribute('height', '140')
    canv.className = 'frame-item'
    curFrame.appendChild(canv)

    const numDiv = document.createElement('div')
    numDiv.className = 'numb'
    curFrame.appendChild(numDiv)
    numb = curFrame.parentElement.children.length - 1
    numDiv.textContent = numb

    getDivColor()
    drawFrame()
  }

  let el = 0
  var canvasPrev = document.getElementById('canvas-preview')
  var cprev = canvasPrev.getContext('2d')

  function animation () {
    setTimeout(function () {
      window.webkitRequestAnimationFrame(animation)
      cprev.clearRect(0, 0, 140, 140)
      let framePreview = frames[el]
      let count = 0
      for (let i = 0; i <= 100; i += 50) {
        for (let j = 0; j <= 100; j += 50) {
          cprev.fillStyle = framePreview[count][0] /* take color */
          if (framePreview[count][1]) { /* define form */
            cprev.beginPath()
            cprev.arc(j + 20, i + 20, 20, 0, 2 * Math.PI)
            cprev.fill()
          } else {
            cprev.fillRect(j, i, 40, 40)
          }
          count += 1
        }
      }

      if ((el < frames.length - 1) && (frames[el + 1])) {
        el += 1
      } else { el = 0 }
    }, 1000 / fps)
  }

  // Draw main "canvas" in according to current Frame
  function drawMain () {
    if (frame) {
      for (let i = 1; i < 10; i += 1) {
        document.getElementById(i).style.backgroundColor = frame[i - 1][0]
        if (frame[i - 1][1]) {
          if (!document.getElementById(i).classList.contains('circle')) { document.getElementById(i).classList.toggle('circle') }
        } else {
          if (document.getElementById(i).classList.contains('circle')) { document.getElementById(i).classList.toggle('circle') }
        }
      }
    }
  }

  function searchFrame () {
    let pos = curFrame.children[2].textContent
    frame = frames[pos - 1].slice()
  }

  // Make frame - current by clicking

  function makeCurrentFrame (event) {
    let target = event.target
    let item = target.closest('.frame')
    if (item.classList.contains('current')) { return }

    let copy = frame.slice()
    frames[curFrame.children[2].textContent - 1] = copy

    if (!item) { return }
    if (curFrame.classList.contains('current')) { curFrame.classList.toggle('current') }
    curFrame = item
    if (!item.classList.contains('current')) { item.classList.toggle('current') }
    searchFrame()
    drawMain()
  }

  // Delete frame //

  function deleteFrame (event) {
    let target = event.target
    let btnDel = target.closest('.delete')
    if (!btnDel) { return }
    if (curFrame.classList.contains('current')) { curFrame.classList.toggle('current') }
    let parentFrame = curFrame.parentElement
    parentFrame.removeChild(curFrame)
    frames.splice(curFrame.children[2].textContent - 1, 1)
    curFrame = parentFrame.children[parentFrame.children.length - 2]
    if (!curFrame.classList.contains('current')) { curFrame.classList.toggle('current') }
    for (let i = 0; i <= parentFrame.children.length - 2; i += 1) {
      parentFrame.children[i].children[2].textContent = i + 1
    }

    searchFrame()
    drawMain()
  }

  const containerFrames = document.getElementById('frames')
  containerFrames.addEventListener('click', deleteFrame)
  containerFrames.addEventListener('click', makeCurrentFrame)

  // *****************///

  var currentMode = 'none'
  /// Hot keys///////////////

  function hotKeys (event) {
    var id = event.keyCode - 48
    if (event.shiftKey) {
      if (id === 1) { // Shift+1
        currentMode = 'paintBucket'
      }
      if (id === 2) { // Shift+2
        currentMode = 'chooseColor'
      }

      if (id === 4) { // Shift+4
        currentMode = 'transform'
      }
    }
  }

  const body = document.getElementById('body')
  body.addEventListener('keyup', hotKeys)

  /// Colors/////////

  var current = 'red'

  /// PaintBucket////////////////
  const paintBucket = document.getElementById('paint-btn')

  paintBucket.addEventListener('click', function (event) {
    currentMode = 'paintBucket'
  })

  /// ChooseColor////////////////////
  const chooseColor = document.getElementById('choose-btn')
  chooseColor.addEventListener('click', function (event) {
    currentMode = 'chooseColor'
    chooseColor.style.backgroundColor = current
  })

  /// Click Event  ///////////////////////
  function clickEvent (event) {
    if (currentMode === 'chooseColor') {
      var computedStyle = window.getComputedStyle(event.target)
      current = computedStyle.backgroundColor
    }
  }

  document.addEventListener('click', clickEvent)

  /// Remove Click Event for chooseColor
  chooseColor.removeEventListener('click', clickEvent)

  /// Transform   ////////////////////////
  const transform = document.getElementById('transform-btn')

  transform.addEventListener('click', function (event) {
    currentMode = 'transform'
  })

  /// Canvas///////////////

  function painting (e) {
    let target = e.target
    let figure = target.closest('.figure')
    if (!figure) { return }
    if (currentMode === 'paintBucket') {
      e.target.style.backgroundColor = current
      getDivColor()
      drawFrame()
    }
  };

  function transformation (e) {
    if (currentMode === 'transform') {
      e.target.classList.toggle('circle')
      getDivColor()
      drawFrame()
    }
  }

  ///   Figure Event//////
  const canvasMain = document.getElementById('canvas-main')

  canvasMain.addEventListener('click', painting)

  canvasMain.addEventListener('click', transformation)
}

appStart()
