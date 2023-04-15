const board = (() => {
  const boardArray = Array(3)

  const resetBoard = () => {
    for (let i = 0; i < boardArray.length; i++) {
      boardArray[i] = [' ', ' ', ' ']
    }
    player = 0 // X traditionally plays first
  }

  const playerTokens = ['X', 'O']
  let playerNames = ['Player 1', 'Player 2']
  let player = 0
  let aiPlayers = []

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
      return
    }

    handleAI()
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

  const newGame = (player1Name, player2Name, AI1, AI2) => {
    aiPlayers = []
    if (AI1) {
      aiPlayers.push(0)
    }
    if (AI2) {
      aiPlayers.push(1)
    }

    resetBoard()
    editPlayerNames(player1Name, player2Name)
    display.update()
    handleAI()
  }

  const playAIMove = () => {
    const move = ai.playMove(
      getBoard(),
      playerTokens[player],
      playerTokens[1 - player]
    )
    playMove(move[0], move[1])
  }

  // This function calls playAIMove if appropriate
  const handleAI = () => {
    if (aiPlayers.includes(player)) {
      playAIMove()
    }
  }

  resetBoard()

  return {
    getBoard,
    playMove,
    resetBoard,
    newGame,
    playAIMove
  }
})()

const ai = (() => {
  const playMove = (boardArray, token, otherToken) => {
    const moves = getMoveList(boardArray)
    const moveList = []
    for (const move of moves) {
      const copyArray = boardArray.map(elem => [...elem])
      copyArray[move[0]][move[1]] = token
      const value = miniMax(copyArray, token, otherToken, false)
      moveList.push([value, move])
    }

    console.log(moveList)
    return moveList.reduce(
      (max, current) => (max[0] >= current[0] ? max : current),
      moveList[0]
    )[1]
  }

  const miniMax = (boardArray, token, otherToken, isAITurn) => {
    return Math.random()
  }

  const getMoveList = boardArray => {
    const moveList = []

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardArray[i][j] === ' ') {
          moveList.push([i, j])
        }
      }
    }

    return moveList
  }

  return { playMove }
})()

const display = (() => {
  const boardDiv = document.querySelector('.board')
  const newGameButton = document.querySelector('#newgame')

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
    for (const elem of document.querySelectorAll('.square')) {
      elem.disabled = true
    }

    setTimeout(() => {
      if (playerName === 'draw') {
        displayMessage('draw')
      } else {
        displayMessage(`${playerName} won!!`)
      }
    }, 1000)
  }

  const newGameHandler = e => {
    e.preventDefault()

    const player1Input = document.querySelector('#player1')
    const player2Input = document.querySelector('#player2')

    const AI1Check = document.querySelector('#ai1')
    const AI2Check = document.querySelector('#ai2')

    const AI1 = AI1Check.checked
    const AI2 = AI2Check.checked

    let player1Name = player1Input.value
    let player2Name = player2Input.value

    player1Name = player1Name === '' ? 'Player 1' : player1Name
    player2Name = player2Name === '' ? 'Player 2' : player2Name

    board.newGame(player1Name, player2Name, AI1, AI2)
  }

  newGameButton.addEventListener('click', newGameHandler)

  displayMessage('press new game to begin')

  return { update, displayWin }
})()
