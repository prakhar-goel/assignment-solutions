def generateListOfWinningConditions(gridSize):
    winningConditions = []

    # Rows
    winningConditions.extend([[i*(gridSize)+j+1 for j in range(gridSize)] for i in range(gridSize)])

    # Columns
    winningConditions.extend([[i + j*(gridSize) + 1 for j in range(gridSize)] for i in range(gridSize)])

    # Diagonal
    winningConditions.append([i*gridSize+i+1 for i in range(gridSize)])

    # Reverse-Diagonal
    winningConditions.append([i*gridSize+(gridSize-i) for i in range(gridSize)])

    return winningConditions

def isWinner(grid, winningConditions, player):
    for condition in winningConditions:
        winnerState = True
        for cell in condition:
            winnerState &= (grid[cell-1]==player)
            if(not winnerState):
                break
        if(winnerState == True):
            return True

    return False

def printGrid(grid, playerSymbols, gridSize, gridSizeSquare):
    for i in range(gridSizeSquare):
        if (grid[i] != -1):
            print("%s\t" % (playerSymbols[grid[i]]), end="")
        else:
            print("%s\t" % (i + 1), end="")

        if (i + 1) % gridSize == 0:
            print("")


def genericTicTacToeGame():
    gridSize = input("Enter Tic Tac Toe Board Size. (Default is 3): ")
    try:
        gridSize = int(gridSize)
    except ValueError:
        gridSize = 3
    if(gridSize < 3):
        gridSize = 3

    gridSizeSquare = gridSize*gridSize
    grid = [-1 for _ in range(gridSizeSquare)]

    # Generating winning conditions
    winningConditions = generateListOfWinningConditions(gridSize)

    playerSymbols = {
        1: "O",
        2: "X"
    }

    playerNames = {}

    # Get Player Names
    playerNames[1] = input("Enter Player 1 Name: ")
    playerNames[2] = input("Enter Player 2 Name: ")

    player = 1
    while True:
        print("\n")
        printGrid(grid,playerSymbols, gridSize, gridSizeSquare)
        move = int(input("Enter number corresponding to %s\'s move: " % (playerNames[player])))
        if(move>=1 and move<=gridSizeSquare and grid[move-1]==-1):
            grid[move-1] = player
            if(isWinner(grid, winningConditions, player)):
                print("\n\n#### Winner is %s ###"%(playerNames[player]))
                print("## Final Tic Tac Toe ##")
                printGrid(grid, playerSymbols, gridSize, gridSizeSquare)
                break
            player = (player % 2) + 1
        else:
            print("###### Wrong Move by %s. Try Again"%(playerNames[player]))

genericTicTacToeGame()
