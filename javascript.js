const board = (() => {
  const boardArray = Array(3)
  for (let i = 0; i < boardArray.length; i++) {
    boardArray[i] = ['X', 'O', ' ']
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

    display.update()
    player = (player + 1) % 2
  }

  return { getBoard, playMove }
})()

const display = (() => {
  const boardDiv = document.querySelector('.board')

  const update = () => {
    // clear previous content from boardDiv
    while (boardDiv.firstChild) {
      boardDiv.removeChild(boardDiv.firstChild)
    }

    for (const row of board.getBoard()) {
      const rowDiv = document.createElement('div')
      rowDiv.classList.add('row')
      for (const square of row) {
        const squareDiv = document.createElement('button')
        squareDiv.classList.add('square')
        squareDiv.textContent = square
        if (squareDiv.textContent !== ' ') {
          squareDiv.disabled = true
        }
        rowDiv.appendChild(squareDiv)
      }
      boardDiv.appendChild(rowDiv)
    }
  }

  update()

  return { update }
})()
