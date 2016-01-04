% includes %

includeUtilities:- include('utilities.pl').
:- use_module(library(lists)).

% Defining Initial Board
board(
      [  
         [[],[],[],[],[],[],[],[]],     
         [[],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[]],
         [[],[1],[1],[1],[1],[1],[1],[]],
         [[],[],[],[],[],[],[],[]],
         [[],[],[],[],[],[],[],[]],
         [[],[0],[0],[0],[0],[0],[0],[]],
         [[],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[]],
         [[],[],[],[],[],[],[],[]]
      ]
     ).

:- dynamic capturedPieces/2.
capturedPieces(0, 0).
capturedPieces(1, 0).
turnToPlay(1).

gameState(board, capturedPieces, turnToPlay).


printBoard(X):- numbers, showBoard(X,1).

%  Running Game %

playGame:-  clearScreen(100),
            retract(capturedPieces(0, _)),
            assert(capturedPieces(0, 0)),
            retract(capturedPieces(1, _)),
            assert(capturedPieces(1, 0)),
            menu,
            write('> '), 
            read(Choice), nl, Choice > 0, Choice =< 3, start(Choice).

               

% Functions that allow Start Or Exit the game %

start(1):- clearScreen(40), gameMode, read(Mode), Mode > 0, Mode =< 2, startGame. % Starting game

start(2):- clearScreen(40), rules, read(Exit), Exit > -1, playGame. % Showing rules
        
start(3):- write('Exiting Game!'). % Exiting game


% Starting Game %

displayMessage([]):- nl, write('\n   -> Press 0 to continue '), read(Continue), Continue > -1.
displayMessage([H|T]):- write(H),
                        displayMessage(T).


startGame:- clearScreen(100),
    write('-> First Player starts with the white pieces'),
    displayMessage([]),
    board(X),
    game_loop(1, X).


game_loop(1, Board):-  % Play Whites
        clearScreen(100),
        printBoard(Board),
        write('\n\n -> Whites Playing. You have captured '),
        capturedPieces(1, Number),
        write(Number),
        write(' pieces until now.\n'),
        write('\n\nVALID MOVES:\n\n'),
        write([['Row', ' Collumn'], ['Move Directions'], ['Splay Directions']]), nl,
        validMoves(Board, 1, List),
        printMoves(List),
        choosePieceToMove(1, Board, NewBoard),
        capturedPieces(1, CheckWin),
        (CheckWin >= 9 -> displayMessage(['\nCongratulations!! The Whites Player won the game!!']),
            playGame
        ;
        game_loop(0, NewBoard)).



game_loop(0, Board):-  % Play blacks
        clearScreen(100),
        printBoard(Board),
        write('\n\n -> Blacks Playing. You have captured '),
        capturedPieces(0, Number),
        write(Number),
        write(' pieces until now.\n'),
        write('\n\nVALID MOVES:\n\n'),
        write([['Row', ' Collumn'], ['Move Directions'], ['Splay Directions']]), nl,
        validMoves(Board, 1, List),
        printMoves(List),
        choosePieceToMove(0, Board, NewBoard),
        capturedPieces(0, CheckWin),
        (CheckWin >= 9 -> displayMessage(['\nCongratulations!! The Blacks Player won the game!!']),
            playGame
        ;
        game_loop(1, NewBoard)).


choosePieceToMove(Player, Board, NewBoard):-
    write('\n    Piece Row '), read(Row), Row > 0, Row =< 8,
    write('\n    Piece Collumn  '), read(Col), Col > 0, Col =< 8,
    (checkLastPiece(Row, Col, Player, Board) ->
        write('\n\n\n Do you want to Move it (M) or Splay it (S)?  '), 
        read(Choice),
        (member(Choice, ['s', 'S']) -> write('\n To which direction do you want to Splay that Stack?\nThe following directions are available:\n\n'),
            checkSplays(Board, Row, Col, Splays),
            write(Splays), nl, nl,
            read(Direction),
            (member(Direction, Splays) -> makePlay(Choice, Row, Col, Direction, Board, TempBoard),
                capture(Player, TempBoard, 1, PiecesCaptured, NewBoard),
                (PiecesCaptured > 0 -> number_chars(PiecesCaptured, NewCapture),
                    displayMessage(['\nYou have captured ', NewCapture, ' piece(s) this round! Keep the good work!']),
                    capturedPieces(Player, CurrentPieces),
                    NewPieces is CurrentPieces + PiecesCaptured,
                    retract(capturedPieces(Player, _)),
                    assert(capturedPieces(Player, NewPieces))
                ;
                    true)
            ;
                displayMessage(['\nYou have to choose an available Direction!']),
                choosePieceToMove(Player, Board, NewBoard))
        ;
            (member(Choice, ['m', 'M']) -> write('\n To which direction do you want to Move that Stack?\nThe following directions are available:\n\n'),
                checkMoves(Board, Row, Col, Moves),
                write(Moves), nl, nl,
                read(Direction),
                (member(Direction, Moves) -> makePlay(Choice, Row, Col, Direction, Board, TempBoard),
                    capture(Player, TempBoard, 1, PiecesCaptured, NewBoard),
                    (PiecesCaptured > 0 -> number_chars(PiecesCaptured, NewCapture),
                        displayMessage(['\nYou have captured ', NewCapture, ' piece(s) this round! Keep the good work!']),
                        capturedPieces(Player, CurrentPieces),
                        NewPieces is CurrentPieces + PiecesCaptured,
                        retract(capturedPieces(Player, _)),
                        assert(capturedPieces(Player, NewPieces))
                    ;
                        true)       
                ;
                    displayMessage(['\nYou have to choose an available Direction!']),
                    choosePieceToMove(Player, Board, NewBoard))
            ;
                displayMessage(['\nYou have to choose an available Play!']),
                choosePieceToMove(Player, Board, NewBoard)))                                   
    ;
        displayMessage(['\nYou cant control that cell! Please choose another one! ']),
        choosePieceToMove(Player, Board, NewBoard)).



checkLastPiece(Row, Col, Player, Board):- % Check if You can play that cell
        getCell(Row, Col, Board, Cell),
        last(Cell, Player).

verifySplayLine(8, 8, Player, Board, SR, SC, Ind):-
    verifySplayCell(8, 8, Player, Board, SR, SC, Ind).

verifySplayLine(Row, 8, Player, Board, SR, SC, Ind):-
    Row >= 1, Row < 8,
    (verifySplayCell(Row, 8, Player, Board, SR, SC, Ind) -> true
    ;
    NewRow is Row + 1,
    verifySplayLine(NewRow, 1, Player, Board, SR, SC, Ind)).

verifySplayLine(Row, Col, Player, Board, SR, SC, Ind):-
    Col < 8, Col >= 1,
    Row >= 1, Row =< 8,
    (verifySplayCell(Row, Col, Player, Board, SR, SC, Ind) -> true
    ;
    NewCol is Col + 1,
    verifySplayLine(Row, NewCol, Player, Board, SR, SC, Ind)).

verifySplayCell(Row, Col, Player, Board, SR, SC, Ind) :-
    checkLastPiece(Row, Col, Player, Board),
    getCell(Row, Col, Board, Cell),
    length(Cell, Number), %%%% Number of pieces in cell
    U is Row - 1, %%%% Distance Row 1
    D is 8 - Row, %%%% Distance Row 8
    L is Col - 1, %%%% Distance Collumn 1
    R is 8 - Col, %%%% Distance Collumn 8
    append([], [0, 0, D, 0, L, 0, R, 0, U], V),
    maxListInd(V, Number, Ind),
    SR is Row,
    SC is Col.


validMoves(Board, Player, FinalList) :-
    (verifySplayLine(1, 1, Player, Board, SR, SC, Ind) -> append([], [[[SR, SC], [], [Ind]]], FinalList)
    ;
    validMovesCell(Board, Player, 1, 1, [], FinalList)).


validMovesCell(Board, Player, 8, 8, OldList, NewList) :-
    (checkLastPiece(8, 8, Player, Board) -> append([], [8, 8], Coords),
        checkMoves(Board, 8, 8, Moves),
        checkSplays(Board, 8, 8, Splays),
        append([], [Coords, Moves, Splays], Cell),
        append(OldList, [Cell], NewList)
    ;
        NewList = OldList).


validMovesCell(Board, Player, Row, 8, OldList, NewList) :-
    Row > 0, Row < 8,
    (checkLastPiece(Row, 8, Player, Board) -> append([], [Row, 8], Coords),
        checkMoves(Board, Row, 8, Moves),
        checkSplays(Board, Row, 8, Splays),
        append([], [Coords, Moves, Splays], Cell),
        append(OldList, [Cell], TempList)
    ;
        TempList = OldList),
    NewRow is Row + 1,
    validMovesCell(Board, Player, NewRow, 1, TempList, NewList).

    
validMovesCell(Board, Player, Row, Col, OldList, NewList) :-
    Row > 0, Row < 9,
    Col > 0, Col < 8,
    (checkLastPiece(Row, Col, Player, Board) -> append([], [Row, Col], Coords),
        checkMoves(Board, Row, Col, Moves),
        checkSplays(Board, Row, Col, Splays),
        append([], [Coords, Moves, Splays], Cell),
        append(OldList, [Cell], TempList)
    ;
        TempList = OldList),
    NewCol is Col + 1,
    validMovesCell(Board, Player, Row, NewCol, TempList, NewList).

                
checkMoves(Board, Row, Col, Moves):- 
        % Check Lower Left
        checkLowerLeft(Board, Row, Col, LowLeft),
        % Check Down
        checkDown(Board, Row, Col, Down),
        % Check Lower Right
        checkLowerRight(Board, Row, Col, LowRight),
        % Check Left
        checkLeft(Board, Row, Col, Left),
        % Check Right
        checkRight(Board, Row, Col, Right),
        % Check Upper Left
        checkUpperLeft(Board, Row, Col, UpLeft),
        % Check Up
        checkUp(Board, Row, Col, Up),
        % Check Upper Right
        checkUpperRight(Board, Row, Col, UpRight),
        append([], [LowLeft, Down, LowRight, Left, Right, UpLeft, Up, UpRight], Moves).


checkRight(Board, Row, Col, Moves):- 
                ((Col < 8,
                NewCol is Col + 1,
                checkIfSplayIsPossible(Board, Row, Col, Row, NewCol)) ->
                Moves is 6 % Right is Valid
                ;
                Moves is 0).

checkLeft(Board, Row, Col, Moves):- 
                ((Col > 1,
                NewCol is Col - 1,
                checkIfSplayIsPossible(Board, Row, Col, Row, NewCol)) ->
                Moves is 4 % Left is Valid
                ;
                Moves is 0).

checkUp(Board, Row, Col, Moves):- 
                ((Row > 1,
                NewRow is Row - 1,
                checkIfSplayIsPossible(Board, Row, Col, NewRow, Col)) ->
                Moves is 8 % Up is Valid
                ;
                Moves is 0).

checkDown(Board, Row, Col, Moves):- 
                ((Row < 8,
                NewRow is Row + 1,
                checkIfSplayIsPossible(Board, Row, Col, NewRow, Col)) ->
                Moves is 2 % Down is Valid
                ;
                Moves is 0).

checkUpperLeft(Board, Row, Col, Moves):- 
                ((Row > 1, Col > 1,
                NewRow is Row - 1,
                NewCol is Col - 1,                
                checkIfSplayIsPossible(Board, Row, Col, NewRow, NewCol)) ->
                Moves is 7 % UpperLeft is Valid
                ;
                Moves is 0).

checkUpperRight(Board, Row, Col, Moves):-
                ((Row < 8, Col < 8,
                NewRow is Row - 1,
                NewCol is Col + 1,
                checkIfSplayIsPossible(Board, Row, Col, NewRow, NewCol)) ->
                Moves is 9 % UpperRight is Valid
                ;
                Moves is 0).

checkLowerRight(Board, Row, Col, Moves):- 
                ((Row < 8, Col < 8,
                NewRow is Row + 1,
                NewCol is Col + 1,
                checkIfSplayIsPossible(Board, Row, Col, NewRow, NewCol)) ->
                Moves is 3 % LowerRight is Valid.
                ;
                Moves is 0).

checkLowerLeft(Board, Row, Col, Moves):-
                ((Row > 1, Col > 1,
                NewRow is Row + 1,
                NewCol is Col - 1,
                checkIfSplayIsPossible(Board, Row, Col, NewRow, NewCol)) ->
                Moves is 1 % LowerLeft is Valid.
                ;
                Moves is 0).

checkIfSplayIsPossible(Board, Row, Col, NewRow, NewCol):- 
                getCell(Row, Col, Board, Cell),
                getCell(NewRow, NewCol, Board, NextCell),
                length(Cell, NumPiecesLast),
                length(NextCell, NumPiecesNext),
                NumPieces is NumPiecesLast + NumPiecesNext,
                         (8 - Col >= NumPieces -> true ; % Checking right Splay
                                 (Col - 1 >= NumPieces -> true ; % Checking left Splay
                                        (8 - Row >= NumPieces -> true; % Checking Down Splay
                                                 (Row - 1 >= NumPieces -> true)))). % Checking Up Splay

checkSplays(Board, Row, Col, Splays):-
                checkSplayRight(Board, Row, Col, SR),
                checkSplayLeft(Board, Row, Col, SL),
                checkSplayUp(Board, Row, Col, SU),
                checkSplayDown(Board, Row, Col, SD),
                checkSplayUpRight(Board, Row, Col, SUR),
                checkSplayUpLeft(Board, Row, Col, SUL),
                checkSplayDownRight(Board, Row, Col, SDR),
                checkSplayDownLeft(Board, Row, Col, SDL),
                append([], [SDL, SD, SDR, SL, SR, SUL, SU, SUR], Splays).



checkSplayRight(Board, Row, Col, SplayRight):- 
                getCell(Row, Col, Board, Cell),
                length(Cell, NumPieces),
                 (8 - Col >= NumPieces -> SplayRight is 6;
                        SplayRight is 0).

checkSplayLeft(Board, Row, Col, SplayRight):- 
                getCell(Row, Col, Board, Cell),
                length(Cell, NumPieces),
                 (Col - 1 >= NumPieces -> SplayRight is 4;
                        SplayRight is 0).

checkSplayUp(Board, Row, Col, SplayRight):- 
                getCell(Row, Col, Board, Cell),
                length(Cell, NumPieces),
                 (Row - 1 >= NumPieces -> SplayRight is 8;
                        SplayRight is 0).

checkSplayDown(Board, Row, Col, SplayRight):- 
                getCell(Row, Col, Board, Cell),
                length(Cell, NumPieces),
                 (8 - Row >= NumPieces -> SplayRight is 2;
                        SplayRight is 0).

checkSplayUpRight(Board, Row, Col, SUR):- 
                getCell(Row, Col, Board, Cell),
                length(Cell, NumPieces),
                 ((8 - Col >= NumPieces, Row - 1 >= NumPieces) -> SUR is 9;
                        SUR is 0).

checkSplayUpLeft(Board, Row, Col, SUL):- 
                getCell(Row, Col, Board, Cell),
                length(Cell, NumPieces),
                 ((Col - 1 >= NumPieces, Row - 1 >= NumPieces) -> SUL is 7;
                        SUL is 0).

checkSplayDownLeft(Board, Row, Col, SDL):- 
                getCell(Row, Col, Board, Cell),
                length(Cell, NumPieces),
                 ((Col - 1 >= NumPieces, 8 - Row >= NumPieces) -> SDL is 1;
                        SDL is 0).

checkSplayDownRight(Board, Row, Col, SDR):- 
                getCell(Row, Col, Board, Cell),
                length(Cell, NumPieces),
                 ((8 - Col >= NumPieces, 8 - Row >= NumPieces) -> SDR is 3;
                        SDR is 0).


makePlay('s', Row, Col, Direction, OldBoard, NewBoard):- makePlay('S', Row, Col, Direction, OldBoard, NewBoard).
makePlay('m', Row, Col, Direction, OldBoard, NewBoard):- makePlay('M', Row, Col, Direction, OldBoard, NewBoard).

makePlay('M', Row, Col, 8, OldBoard, NewBoard):- % MOVE UP
    getCell(Row, Col, OldBoard, Cell),
    emptyCell(Row, Col, OldBoard, Y),
    NewRow is Row - 1,
    setCell(NewRow, Col, Y, Cell, NewBoard).

makePlay('M', Row, Col, 2, OldBoard, NewBoard):- % MOVE DOWN
    getCell(Row, Col, OldBoard, Cell),
    emptyCell(Row, Col, OldBoard, Y),
    NewRow is Row + 1,
    setCell(NewRow, Col, Y, Cell, NewBoard).

makePlay('M', Row, Col, 4, OldBoard, NewBoard):- % MOVE LEFT
    getCell(Row, Col, OldBoard, Cell),
    emptyCell(Row, Col, OldBoard, Y),
    NewCol is Col - 1,
    setCell(Row, NewCol, Y, Cell, NewBoard).

makePlay('M', Row, Col, 6, OldBoard, NewBoard):- % MOVE RIGHT
    getCell(Row, Col, OldBoard, Cell),
    emptyCell(Row, Col, OldBoard, Y),
    NewCol is Col + 1,
    setCell(Row, NewCol, Y, Cell, NewBoard).

makePlay('M', Row, Col, 7, OldBoard, NewBoard):- % MOVE UPPER LEFT
    getCell(Row, Col, OldBoard, Cell),
    emptyCell(Row, Col, OldBoard, Y),
    NewRow is Row - 1,
    NewCol is Col - 1,
    setCell(NewRow, NewCol, Y, Cell, NewBoard).

makePlay('M', Row, Col, 9, OldBoard, NewBoard):- % MOVE UPPER RIGHT
    getCell(Row, Col, OldBoard, Cell),
    emptyCell(Row, Col, OldBoard, Y),
    NewRow is Row - 1,
    NewCol is Col + 1,
    setCell(NewRow, NewCol, Y, Cell, NewBoard).

makePlay('M', Row, Col, 1, OldBoard, NewBoard):- % MOVE LOWER LEFT
    getCell(Row, Col, OldBoard, Cell),
    emptyCell(Row, Col, OldBoard, Y),
    NewRow is Row + 1,
    NewCol is Col - 1,
    setCell(NewRow, NewCol, Y, Cell, NewBoard).

makePlay('M', Row, Col, 3, OldBoard, NewBoard):- % MOVE LOWER RIGHT
    getCell(Row, Col, OldBoard, Cell),
    emptyCell(Row, Col, OldBoard, Y),
    NewRow is Row + 1,
    NewCol is Col + 1,
    setCell(NewRow, NewCol, Y, Cell, NewBoard).


makePlay('S', Row, Col, Direction, OldBoard, NewBoard):-
        getCell(Row, Col, OldBoard, Cell),
        length(Cell, Number),
        emptyCell(Row, Col, OldBoard, Y),
        makeSplay(Row, Col, Direction, Y, Cell, Number, NewBoard).

makeSplay(_, _, _, X, _, 0, X).

makeSplay(Row, Col, 8, OldBoard, Cell, Number, NewBoard) :-  %%%% SPLAY UP
        NewRow is Row - 1,
        Number > 0,
        NewNumber is Number - 1,
        nth0(NewNumber, Cell, Piece),
        setCell(NewRow, Col, OldBoard, [Piece], Y),
        makeSplay(NewRow, Col, 8, Y, Cell, NewNumber, NewBoard).

makeSplay(Row, Col, 2, OldBoard, Cell, Number, NewBoard) :-  %%%% SPLAY DOWN
        NewRow is Row + 1,
        Number > 0,
        NewNumber is Number - 1,
        nth0(NewNumber, Cell, Piece),
        setCell(NewRow, Col, OldBoard, [Piece], Y),
        makeSplay(NewRow, Col, 2, Y, Cell, NewNumber, NewBoard).

makeSplay(Row, Col, 4, OldBoard, Cell, Number, NewBoard) :-  %%%% SPLAY LEFT
        NewCol is Col - 1,
        Number > 0,
        NewNumber is Number - 1,
        nth0(NewNumber, Cell, Piece),
        setCell(Row, NewCol, OldBoard, [Piece], Y),
        makeSplay(Row, NewCol, 4, Y, Cell, NewNumber, NewBoard).

makeSplay(Row, Col, 6, OldBoard, Cell, Number, NewBoard) :-  %%%% SPLAY RIGHT
        NewCol is Col + 1,
        Number > 0,
        NewNumber is Number - 1,
        nth0(NewNumber, Cell, Piece),
        setCell(Row, NewCol, OldBoard, [Piece], Y),
        makeSplay(Row, NewCol, 6, Y, Cell, NewNumber, NewBoard).

makeSplay(Row, Col, 7, OldBoard, Cell, Number, NewBoard) :-  %%%% SPLAY UPPER LEFT
        NewRow is Row - 1,
        NewCol is Col - 1,
        Number > 0,
        NewNumber is Number - 1,
        nth0(NewNumber, Cell, Piece),
        setCell(NewRow, NewCol, OldBoard, [Piece], Y),
        makeSplay(NewRow, NewCol, 7, Y, Cell, NewNumber, NewBoard).

makeSplay(Row, Col, 9, OldBoard, Cell, Number, NewBoard) :-  %%%% SPLAY UPPER RIGHT
        NewRow is Row - 1,
        NewCol is Col + 1,
        Number > 0,
        NewNumber is Number - 1,
        nth0(NewNumber, Cell, Piece),
        setCell(NewRow, NewCol, OldBoard, [Piece], Y),
        makeSplay(NewRow, NewCol, 9, Y, Cell, NewNumber, NewBoard).

makeSplay(Row, Col, 1, OldBoard, Cell, Number, NewBoard) :-  %%%% SPLAY LOWER LEFT
        NewRow is Row + 1,
        NewCol is Col - 1,
        Number > 0,
        NewNumber is Number - 1,
        nth0(NewNumber, Cell, Piece),
        setCell(NewRow, NewCol, OldBoard, [Piece], Y),
        makeSplay(NewRow, NewCol, 1, Y, Cell, NewNumber, NewBoard).

makeSplay(Row, Col, 3, OldBoard, Cell, Number, NewBoard) :-  %%%% SPLAY LOWER RIGHT
        NewRow is Row + 1,
        NewCol is Col + 1,
        Number > 0,
        NewNumber is Number - 1,
        nth0(NewNumber, Cell, Piece),
        setCell(NewRow, NewCol, OldBoard, [Piece], Y),
        makeSplay(NewRow, NewCol, 3, Y, Cell, NewNumber, NewBoard).

capture(1, Board, Col, PiecesCaptured, NewBoard):-
        captureBlacks(Board, Col, PiecesCaptured, NewBoard).

capture(0, Board, Col, PiecesCaptured, NewBoard):-
        captureWhites(Board, Col, PiecesCaptured, NewBoard).
 

captureBlacks(Board, 8, PiecesCaptured, NewBoard):-
        getCell(1, 8, Board, CurrentCell),
        (member(0, CurrentCell) -> length(CurrentCell, CurrentSize),
                                    delete(CurrentCell, 0, NewCell),
                                    length(NewCell, Size),
                                    PiecesCaptured is CurrentSize - Size,
                                    emptyCell(1, 8, Board, TempBoard),
                                    setCell(1, 8, TempBoard, NewCell, NewBoard)
        ; NewBoard = Board,
        PiecesCaptured is 0).     

captureBlacks(Board, Col, PiecesCaptured, NewBoard):-
        Col > 0, Col < 8,
        NewCol is Col + 1,
        getCell(1, Col, Board, CurrentCell),
        (member(0, CurrentCell) -> length(CurrentCell, CurrentSize),
                                    delete(CurrentCell, 0, NewCell),
                                    length(NewCell, Size),
                                    PiecesTemp is CurrentSize - Size,
                                    emptyCell(1, Col, Board, TempBoard),
                                    setCell(1, Col, TempBoard, NewCell, TempBoard2)
        ; TempBoard2 = Board,
        PiecesTemp is 0),
        captureBlacks(TempBoard2, NewCol, Pieces, NewBoard),
        PiecesCaptured is PiecesTemp + Pieces.

captureWhites(Board, 8, PiecesCaptured, NewBoard):-
        getCell(8, 8, Board, CurrentCell),
        (member(1, CurrentCell) -> length(CurrentCell, CurrentSize),
                                    delete(CurrentCell, 1, NewCell),
                                    length(NewCell, Size),
                                    PiecesCaptured is CurrentSize - Size,
                                    emptyCell(8, 8, Board, TempBoard),
                                    setCell(8, 8, TempBoard, NewCell, NewBoard)
        ; NewBoard = Board,
        PiecesCaptured is 0).  
                
captureWhites(Board, Col, PiecesCaptured, NewBoard):-
        Col > 0, Col < 8,
        NewCol is Col + 1,
        getCell(8, Col, Board, CurrentCell),
        (member(1, CurrentCell) -> length(CurrentCell, CurrentSize),
                                    delete(CurrentCell, 1, NewCell),
                                    length(NewCell, Size),
                                    PiecesTemp is CurrentSize - Size,
                                    emptyCell(8, Col, Board, TempBoard),
                                    setCell(8, Col, TempBoard, NewCell, TempBoard2)
        ;  TempBoard2 = Board,
        PiecesTemp is 0),
        captureWhites(TempBoard2, NewCol, Pieces, NewBoard),
        PiecesCaptured is PiecesTemp + Pieces.