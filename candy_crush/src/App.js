import { useCallback, useEffect, useState } from "react"
import ScoreBoard from "./Components/ScoreBoard"
// import './index.css'
import blueCandy from './Images/Blue.webp'
import greenCandy from './Images/Green.webp'
import orangeCandy from './Images/Orange.webp'
import purpleCandy from './Images/Purple.webp'
import redCandy from './Images/Red.webp'
import yellowCandy from './Images/Yellow.webp'
import blank from './Images/Blank.png'

const width = 8
const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy]

const App = () => {

  const [currentColorArrangement, setCurrentColorArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)

  // console.log(scoreDisplay)

  const dragStart = (e) => {
    // console.log(e.target)
    // console.log('dragStart');
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    // console.log(e.target)
    // console.log('dragDrop');
    setSquareBeingReplaced(e.target)
  }

  const dragEnd = (e) => {
    // console.log('dragEnd')

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute(`data-id`))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute(`data-id`))

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute(`src`)
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute(`src`)

    // console.log('square being draggedId', squareBeingDraggedId)
    // console.log('square being replacedId', squareBeingReplacedId)

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId)

    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()

    if (squareBeingDraggedId && validMove &&
      (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    } else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute(`src`)
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute(`src`)
      setCurrentColorArrangement([...currentColorArrangement])
    }
  }

  const createBoard = () => {
    const randomColorArrangement = []
    for (let i = 0; i < width * width; i++) {
      const randomNumberForm0To5 = Math.floor(Math.random() * candyColors.length)
      const randomColor = candyColors[randomNumberForm0To5]
      randomColorArrangement.push(randomColor)
    }
    setCurrentColorArrangement(randomColorArrangement)
  }

  const checkForColumnOfFour = useCallback(() => {
    for (let i = 0; i < 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank
      if (columnOfFour.every((square) => (currentColorArrangement[square] === decidedColor && !isBlank))) {
        setScoreDisplay((score) => (score + 4))
        columnOfFour.forEach((square) => (currentColorArrangement[square] = blank))
        return true
      }
    }
  }, [currentColorArrangement])

  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i < 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank
      if (columnOfThree.every((square) => (currentColorArrangement[square] === decidedColor && !isBlank))) {
        setScoreDisplay((score) => (score + 3))
        columnOfThree.forEach((square) => (currentColorArrangement[square] = blank))
        return true
      }
    }
  }, [currentColorArrangement])

  const checkForRowOfFour = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      const isBlank = currentColorArrangement[i] === blank

      if (rowOfFour.every((square) => (currentColorArrangement[square] === decidedColor && !isBlank))) {
        setScoreDisplay((score) => (score + 4))
        rowOfFour.forEach((square) => (currentColorArrangement[square] = blank))
        return true
      }

      if (notValid.includes(i)) {
        continue
      }
    }
  }, [currentColorArrangement])

  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      const isBlank = currentColorArrangement[i] === blank

      if (notValid.includes(i)) {
        continue
      }

      if (rowOfThree.every((square) => (currentColorArrangement[square] === decidedColor && !isBlank))) {
        setScoreDisplay((score) => (score + 3))
        rowOfThree.forEach((square) => (currentColorArrangement[square] = blank))
        return true
      }
    }
  }, [currentColorArrangement])

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i < 64 - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColorArrangement[i] = candyColors[randomNumber]
      }

      if ((currentColorArrangement[i + width]) === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = blank
      }
    }
  }, [currentColorArrangement])

  useEffect(() => {
    createBoard()
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()
      checkForColumnOfThree()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setCurrentColorArrangement([...currentColorArrangement])
    }, 1000)
    return (() => clearInterval(timer))
  }, [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfThree, checkForRowOfFour, moveIntoSquareBelow, currentColorArrangement]);

  // console.log(currentColorArrangement);
  return (
    <div className="App">
      <div className="game">
        {currentColorArrangement.map((candyColors, index) => (<img
          key={index}
          src={candyColors}
          alt={candyColors}
          data-id={index}
          draggable={true}
          onDragStart={dragStart}
          onDragOver={(event) => { event.preventDefault() }}
          onDragEnter={(event) => { event.preventDefault() }}
          onDragLeave={(event) => { event.preventDefault() }}
          onDrop={dragDrop}
          onDragEnd={dragEnd}
        ></img>))}
      </div>
      <ScoreBoard score={scoreDisplay}></ScoreBoard>
    </div >
  );
}

export default App;