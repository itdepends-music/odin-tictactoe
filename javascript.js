const gameBoard = (() => {
  const board = Array(3)
  for (let i = 0; i < board.length; i++) {
    board[i] = [0, 0, 0]
  }

  const getBoard = () => {
    return board.map(elem => [...elem]) // return deep copy of board
  }

  return { getBoard }
})()
