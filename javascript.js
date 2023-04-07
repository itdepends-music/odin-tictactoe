const board = (() => {
  const board = Array(3)
  for (let i = 0; i < board.length; i++) {
    board[i] = ['X', 'O', ' ']
  }

  const getBoard = () => {
    return board.map(elem => [...elem]) // return deep copy of board
  }

  return { getBoard }
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
})()
