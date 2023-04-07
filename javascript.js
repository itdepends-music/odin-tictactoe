const board = (() => {
  const boardArray = Array(3)
  for (let i = 0; i < boardArray.length; i++) {
    boardArray[i] = [' ', ' ', ' ']
  }

  const playerTokens = ['X', 'O']
  let player = 0

  const getBoard = () => {
    return boardArray.map(elem => [...elem]) // return deep copy of boardArray
  }

  const playMove = (x, y) => {
    const token = playerTokens[player]

    if (boardArray[x][y] === ' ') {
      boardArray[x][y] = token
    }

    checkWin()
    display.update()
    player = (player + 1) % 2
  }

  const checkWin = () => {
    for (const token of playerTokens) {
      // check horizontal
      for (const row of boardArray) {
        let isWin = true
        for (const square of row) {
          if (square !== token) {
            isWin = false
          }
        }
        if (isWin) {
          handleWin(token)
          break
        }
      }

      // check vertical
      for (let i = 0; i < 3; i++) {
        let isWin = true
        for (const row of boardArray) {
          if (row[i] !== token) {
            isWin = false
          }
        }
        if (isWin) {
          handleWin(token)
          break
        }
      }

      // check top right to bottom left
      let isWin = true
      for (let i = 0; i < 3; i++) {
        if (boardArray[i][2 - i] !== token) {
          isWin = false
        }
      }
      if (isWin) {
        handleWin(token)
        break
      }

      // check top left to bottom right
      isWin = true
      for (let i = 0; i < 3; i++) {
        if (boardArray[i][i] !== token) {
          isWin = false
        }
      }
      if (isWin) {
        handleWin(token)
        break
      }
    }
  }

  const handleWin = playerToken => {
    console.log(`Player with token ${playerToken} won`)
  }

  return { getBoard, playMove }
})()

const display = (() => {
  const boardDiv = document.querySelector('.board')

  const clickHandler = event => {
    const x = event.target.dataset.x
    const y = event.target.dataset.y

    board.playMove(x, y)
  }

  const update = () => {
    // clear previous content from boardDiv
    while (boardDiv.firstChild) {
      boardDiv.removeChild(boardDiv.firstChild)
    }

    let i = 0
    for (const row of board.getBoard()) {
      const rowDiv = document.createElement('div')
      rowDiv.classList.add('row')

      let j = 0
      for (const square of row) {
        const squareDiv = document.createElement('button')
        squareDiv.classList.add('square')
        squareDiv.textContent = square
        if (squareDiv.textContent !== ' ') {
          squareDiv.disabled = true
        }
        squareDiv.dataset.x = i
        squareDiv.dataset.y = j
        squareDiv.addEventListener('click', clickHandler)
        rowDiv.appendChild(squareDiv)

        j++
      }
      boardDiv.appendChild(rowDiv)
      i++
    }
  }

  update()

  return { update }
})()
