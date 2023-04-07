const GameBoard = (() => {
  const board = Array(3)
  for (let i = 0; i < board.length; i++) {
    board[i] = [' ', ' ', ' ']
  }

  const getBoard = () => {
    return board.map(elem => [...elem]) // return deep copy of board
  }

  return { getBoard }
})()
