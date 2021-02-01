const xiketic = document.getElementById('xiketic')
const yellow = document.getElementById('yellow')
const persian = document.getElementById('persian')
const green = document.getElementById('green')
const btnStart = document.getElementById('btnStart')
const score = document.getElementById('score')
const maxScore = document.getElementById('max-score')
const bpSound = new Audio('./media/ogg/beep.ogg')
const LAST_LEVEL = 10

let scoreCount = 0
let maxScoreCount = 0

class Game {
    constructor() {
      this.init = this.init.bind(this)
      this.init()
      this.genSequence()

      setTimeout(() => {
        this.nextLevel()
      }, 1000)
    } 
    
    init() {     
        this.nextLevel = this.nextLevel.bind(this)
        this.chooseColor = this.chooseColor.bind(this)
        this.togglebtnStart()
        this.level = 1
        this.colors = {
          xiketic, 
          yellow,
          persian,
          green
          }
        scoreCount = 0
        score.innerHTML = scoreCount
    }
    
    togglebtnStart() {
      btnStart.classList.contains('hide') ? btnStart.classList.remove('hide') : btnStart.classList.add('hide')
    }

    genSequence() {
        this.sequence = new Array(LAST_LEVEL).fill(0).map(n => Math.floor(Math.random() * 4))
    }

    nextLevel() {
        this.sublevel = 0
        this.illumSequence()
        this.addClickEvents()
        this.colorsAdd()
    }

    numToColor(num) {
        switch (num) {
            case 0: 
                return 'xiketic'
            case 1:
                return 'yellow'
            case 2:
                return 'persian'
            case 3:
                return 'green'
        }
    }

    colorToNum(color) {
      switch (color) {
          case 'xiketic': 
              return 0
          case 'yellow':
              return 1
          case 'persian':
              return 2
          case 'green':
              return 3
      }
  }

    illumSequence() {
        for (let i = 0; i < this.level; i++){
            const color = this.numToColor(this.sequence[i]) 
            setTimeout(() => this.illumColor(color), 1000 * i)
        }
    }

    illumColor(color) {
        this.colors[color].classList.add('light')
        setTimeout(() => this.offColor(color), 350)
        bpSound.play()
    }

    offColor(color) {
        this.colors[color].classList.remove('light')
    }

    addClickEvents() {
      this.colors.xiketic.addEventListener('click', this.chooseColor)
      this.colors.green.addEventListener('click', this.chooseColor)
      this.colors.yellow.addEventListener('click', this.chooseColor)
      this.colors.persian.addEventListener('click', this.chooseColor)
    }

    deleteClickEvents() {
      this.colors.xiketic.removeEventListener('click', this.chooseColor)
      this.colors.green.removeEventListener('click', this.chooseColor)
      this.colors.yellow.removeEventListener('click', this.chooseColor)
      this.colors.persian.removeEventListener('click', this.chooseColor)
    }

    colorsAdd() {
      xiketic.classList.add('active')
      yellow.classList.add('active')
      persian.classList.add('active')
      green.classList.add('active')
    }

    colorsRem() {
      xiketic.classList.remove('active')
      yellow.classList.remove('active')
      persian.classList.remove('active')
      green.classList.remove('active')
    }

    chooseColor(ev) {
      const colorName = ev.target.dataset.color
      const numColor = this.colorToNum(colorName)
      this.illumColor(colorName)

      if (numColor === this.sequence[this.sublevel]) {
        this.sublevel++
        if (this.sublevel === this.level) {
          this.level++
          this.deleteClickEvents()
          if (this.level === (LAST_LEVEL + 1)) {
            this.userWon()
            this.colorsRem()
          } else {
            this.levelComplete()
          }
        }
      } else {
        this.userLose()
        this.colorsRem()
      }
    }

    levelComplete() {
      scoreCount++
      score.innerHTML = scoreCount
      swal(`Round ${this.level - 1} completed`, 'Proceed to next round', 'success')
        .then (() => {
          setTimeout(this.nextLevel, 1500)
        })
    }

    userWon() {
      maxScoreCount = scoreCount
      maxScore.innerHTML = maxScoreCount
      swal('Congratulations!', 'You won', 'success')
        .then (this.init)
    }

    userLose() {
      if (maxScoreCount < scoreCount) {
        maxScoreCount = scoreCount
        maxScore.innerHTML = maxScoreCount
      }
      swal('Try again', 'You lost :(', 'error')
        .then (() => {
          this.deleteClickEvents()
          this.init()
        })
    }
}    

function startGame() {    
    window.Game = new Game()
}