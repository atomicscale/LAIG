:- use_module(library(lists)).

% Clear Screen %

clearScreen(0).
clearScreen(N):- nl, N1 is N-1, clearScreen(N1).

% Interface outputs %


menu:- write('        PLOG 2015/2016        \n'),
       write('------------------------------\n'),
       write('######### Splay Game #########\n'),
       write('------------------------------\n'),
       write('#   1. Play                  #\n'),
       write('#   2. Rules                 #\n'),     
       write('#   3. Exit                  #\n'),
       write('##############################\n'),
       write('------------------------------\n').


rules:- write('        PLOG 2015/2016        \n'),
        write('------------------------------\n'),
        write('######### Splay Game #########\n'),
        write('------------------------------\n'),
        write('#          Rules             #\n'),
        write('------------------------------\n'),
        write('\n CAPTURE - At the end of each move, if there are any white pieces in any of the stacks \n on row 1 or any black pieces in any of the stacks in row 8, these are removed from the stacks \n and captured by the opponent.\n\n GOAL - The first player that captures 9 enemy stones wins.\n'),
        write('\n Directions - 1(LOWER LEFT), 2(DOWN), 3(LOWER RIGHT), 4(LEFT), 6(RIGHT), 7(UPPER LEFT), 8(UP), 9(UPPER RIGHT)\n\n'),
        write('##############################\n'),
        write('------------------------------\n'),
        write('Press 0 to back to menu').


gameMode:- write('        PLOG 2015/2016        \n'),
           write('------------------------------\n'),
           write('######### Splay Game #########\n'),
           write('------------------------------\n'),
           write('#          Game Mode         #\n'),
           write('------------------------------\n'),
           write('     1. Player vs Player      \n\n'),
           write('##############################\n'),
           write('------------------------------\n').
                


% -- Printing Board Game -- %

division:- 
      write('  ---------------------------------------------------------------------------------').

numbers:-
       write('       1        2         3         4         5         6         7         8\n').

convertValues(1):- write('W').
convertValues(0):- write('B').

% printing line %
showLine([]):-  write(' | '), nl.
showLine([FirstCell | SecondCell]):- write('| '), showCell(FirstCell, 0), showLine(SecondCell).

% printing cell %
showCell([],8).
showCell([],N):- N < 8, write(' '), N1 is N + 1, showCell([],N1).
showCell([First | Second], N):- convertValues(First), N1 is N + 1, showCell(Second, N1).

% printing the board %
showBoard([],9):- division.
showBoard([Start | End],N):- division, nl, write(N), write(' '),
                             showLine(Start), 
                             NewNumber is N + 1,
                             showBoard(End,NewNumber).


% -- Changing Board Game -- %


% Setting Board Game - ADDS Change to the selected Cell

setCell(1, Col, [H1 | T], Change, [H2 | T]):-
        setCellColl(Col, H1 , Change, H2).
setCell(Row, Col, [H | T1], Change, [H | T2]):-
        NewRow is Row - 1,
        setCell(NewRow, Col, T1, Change, T2).

setCellColl(1, [H1|T], Change, L):-
        append(H1, Change, H2),
        append([H2], T, L).
setCellColl(Col, [H|T1], Change, [H|T2]):-
        NewCol is Col-1,
        setCellColl(NewCol, T1, Change, T2).


% Getting Cell

getCell(1, Col, [H | _], Cell):-
        getCellColl(Col, H, Cell).
getCell(Row, Col, [_ | T], Cell):-
		Row > 1, Row < 9,
		Col > 0, Col < 9,
        NewRow is Row - 1,
        getCell(NewRow, Col, T, Cell).

getCellColl(1, [H|_], H).

getCellColl(Col, [_|T1], Cell):-
		Col > 1, Col < 9,
        NewCol is Col-1,
        getCellColl(NewCol, T1, Cell).


% Empty a Cell

emptyCell(1, Col, [H1 | T], [H2 | T]) :-
        emptyCellCol(Col, H1, H2).
emptyCell(Row, Col, [H | T1], [H | T2]):-
		Row > 1, Row < 9,
        NewRow is Row - 1,
        emptyCell(NewRow, Col, T1, T2).

emptyCellCol(1, [_ | T], [[] | T]).
emptyCellCol(Col, [H | T1], [H | T2]):-
		Col > 1, Col < 9,
        NewCol is Col - 1,
        emptyCellCol(NewCol, T1, T2).


maxListInd([X|Xs], Max, Index):-
    maxListInd(Xs, X, 0, 0, Max, Index).

maxListInd([],OldMax,OldIndex,_, OldMax, OldIndex).
maxListInd([X|Xs], OldMax, _, CurrentIndex, Max, Index):-
    X > OldMax,
    NewCurrentIndex is CurrentIndex + 1,
    NewIndex is NewCurrentIndex,
    maxListInd(Xs, X, NewIndex, NewCurrentIndex, Max, Index).

maxListInd([X|Xs], OldMax, OldIndex, CurrentIndex, Max, Index):-
    X =< OldMax,
    NewCurrentIndex is CurrentIndex + 1,
    maxListInd(Xs, OldMax, OldIndex, NewCurrentIndex, Max, Index).

printMoves([]) :- nl.

printMoves([H|T]) :-
  write('      '),
  write(H), nl,
  printMoves(T).