const board = (() => {
  const boardArray = Array(3)

  // resetBoard() does not call display.update()
  // This is instead managed by display.displayWin()
  const resetBoard = () => {
    for (let i = 0; i < boardArray.length; i++) {
      boardArray[i] = [' ', ' ', ' ']
    }
    player = 0 // X traditionally plays first
  }

  const playerTokens = ['X', 'O']
  let playerNames = ['Player 1', 'Player 2']
  let player = 0

  const getBoard = () => {
    return boardArray.map(elem => [...elem]) // return deep copy of boardArray
  }

  const playMove = (x, y) => {
    const token = playerTokens[player]

    if (boardArray[x][y] === ' ') {
      boardArray[x][y] = token
    }

    player = (player + 1) % 2
    display.update()
    checkWin()
  }

  const checkWin = () => {
    for (const token of playerTokens) {
      let isTopLeftToBottomRight = true
      let isTopRightToBottomLeft = true
      for (let i = 0; i < 3; i++) {
        if (boardArray[i][i] !== token) {
          isTopLeftToBottomRight = false
        }
        if (boardArray[i][2 - i] !== token) {
          isTopRightToBottomLeft = false
        }

        let isHorz = true
        let isVert = true
        for (let j = 0; j < 3; j++) {
          if (boardArray[i][j] !== token) {
            isHorz = false
          }
          if (boardArray[j][i] !== token) {
            isVert = false
          }
        }
        if (isHorz || isVert) {
          handleWin(token)
          return
        }
      }
      if (isTopLeftToBottomRight || isTopRightToBottomLeft) {
        handleWin(token)
        return
      }
    }

    let isDraw = true
    for (const row of boardArray) {
      for (const val of row) {
        if (val === ' ') isDraw = false
      }
    }

    if (isDraw) {
      handleWin(' ')
    }
  }

  const handleWin = playerToken => {
    const playerNum = playerTokens.indexOf(playerToken)
    let playerName
    if (playerNum === -1) {
      playerName = 'draw'
    } else {
      playerName = playerNames[playerNum]
    }
    display.displayWin(playerName)
  }

  const editPlayerNames = (player1, player2) => {
    playerNames = [player1, player2]
  }

  const getPlayerNames = () => {
    return [...playerNames]
  }

  resetBoard()

  return { getBoard, playMove, resetBoard, editPlayerNames, getPlayerNames }
})()

const display = (() => {
  const boardDiv = document.querySelector('.board')

  const clickHandler = event => {
    const x = event.target.dataset.x
    const y = event.target.dataset.y

    board.playMove(x, y)
  }

  const update = () => {
    clearBoard()

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

  const displayMessage = text => {
    clearBoard()
    const messageElem = document.createElement('p')
    messageElem.classList.add('message')
    messageElem.textContent = text
    boardDiv.appendChild(messageElem)
  }

  const clearBoard = () => {
    while (boardDiv.firstChild) {
      boardDiv.removeChild(boardDiv.firstChild)
    }
  }

  const displayWin = playerName => {
    if (playerName === 'draw') {
      displayMessage('draw')
    } else {
      displayMessage(`${playerName} won!!`)
    }
  }

  displayMessage('press new game to begin')

  return { update, displayWin, displayMessage }
})()
