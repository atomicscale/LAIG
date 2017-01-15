
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%  JOGO DE DAMAS EM PROLOG - LUIS PAULO REIS - 29/10/2003 %%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

:-use_module(library(lists)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%  REPRESENTACAO DO ESTADO  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% estado(?N, ?J, ?Tabuleiro).
% estado_inicial(?Tabuleiro).
estado_inicial(	
	[[8,1,8,1,8,1,8,1],
	[1,8,1,8,1,8,1,8],
	[8,0,8,0,8,0,8,0],
	[0,8,0,8,0,8,0,8],
	[8,0,8,0,8,0,8,0],
	[0,8,0,8,0,8,0,8],
	[8,2,8,2,8,2,8,2],
	[2,8,2,8,2,8,2,8]]).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%  PREDICADOS CENTRAIS DO JOGO  %%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

inicio:-
	abolish(jogador/2), abolish(estado/4),
	apresentacao,
	tipo_jogo,
	estado_inicial(Tab),
	joga(1,1,Tab).

apresentacao:- 
	write('Damas em Prolog - 29/10/2003 - Luis Paulo Reis'), nl, nl.

tipo_jogo:-
	write('1- Hum/Comp, 2-Comp/Hum, 3-Hum/Hum, 4-Comp/Comp'), nl,
	repeat,	get_code(Let), Let>=49, Let=<52,
	tipoj(Let,Jog1,Jog2), 
	assert(jogador(1,Jog1)), assert(jogador(2,Jog2)).

%tipoj(+Let, -Jog1, -Jog2).
tipoj(49,humano,comp).
tipoj(50,comp,humano).
tipoj(51,humano,humano).
tipoj(52,comp,comp).

joga(N,J,Tab):-
	lista_jogadas(J, Tab, Lista), nl, write(Lista), nl,
	write('Jogada: '), write(N), write('   Jogador:'), write(J), nl, 
	visualiza_estado(Tab),
	avalia_estado(J,Tab),
	jogador(J,TipoJ),
	determina_jogada(J,TipoJ,Mov,Tab),
	executa_jogada(J, Mov, Tab, NovoTab),
	write(Mov),nl,write('-------------------------------'),nl,
	guarda_estado(N,J,Mov,NovoTab),
	(finaliza(J,NovoTab) ; continua(N,J,NovoTab)).

avalia_estado(J, Tab):-
	avalia_tabuleiro(J, Tab, Valor),
	write('Avaliacao: '), write(Valor), nl.

guarda_estado(N,J,Mov,NovoTab):-
	assert(estado(N,J,Mov,NovoTab)).

continua(N,J,Tab):-
	N2 is N+1,
	troca(J,J2),
	joga(N2,J2,Tab).

finaliza(J, Tab):-
	troca(J, J2),
	fim_jogo(J2, Tab, Venc),
	visualiza_estado(Tab),
	write('Fim do Jogo. Vencedor: '), write(Venc), nl.

determina_jogada(J,humano,Mov,Tab):-
	repeat,
		pede_jogada(X,Y), 
		pede_jogada(Xf,Yf),    %Falta pedir jogadas compostas! Pensar no caso!
		(Mov = _-_-(X,Y)-(Xf,Yf) ; Mov = _-_-(X,Y)-[(_,_)*(Xf,Yf)]),  
		movimento_valido(J, Mov, Tab).
determina_jogada(J,comp,Mov,Tab):-	
	nivel(Niv),
	calcula_jogada(Niv, J, Mov, Tab).

pede_jogada(X,Y):- get_code(SX), conv(SX,X), get_code(SY), conv(SY,Y).

conv(Let,Valor):- maiuscula(Let), Valor is Let-64.
conv(Let,Valor):- minuscula(Let), Valor is Let-96.
conv(Let,Valor):- numero(Let), Valor is Let-48.

maiuscula(Let):- Let>=65, Let=<72.
minuscula(Let):- Let>=97, Let=<104.
numero(Let):- Let>=49, Let=<56.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%  TRATAMENTO DO TABULEIRO  %%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%dentro(X,Y):- dentro(X), dentro(Y), (X+Y) mod 2 =:= 1. %Pouco optimizado!
%dentro(Valor):- member(Valor,[1,2,3,4,5,6,7,8]).
dentro(X,Y):- impar(X), par(Y).			%Outra hipotese (melhor)!
dentro(X,Y):- par(X), impar(Y).
par(2). par(4). par(6). par(8). impar(1). impar(3). impar(5). impar(7).
diag(1,1). diag(2,2). diag(3,3). diag(4,4). diag(5,5). diag(6,6). diag(7,7).

%direccao(?Dir, ?YDir, ?XDir)
direccao((c,d),-1, 1).
direccao((c,e),-1,-1).
direccao((b,d), 1, 1).
direccao((b,e), 1,-1).

%vizinho(+X,+Y,?X2,?Y2,?(Ver,Hor)).
vizinho(X,Y,X2,Y2,(c,d)):- X2 is X+1, Y2 is Y-1, dentro(X2,Y2).
vizinho(X,Y,X2,Y2,(c,e)):- X2 is X-1, Y2 is Y-1, dentro(X2,Y2).
vizinho(X,Y,X2,Y2,(b,d)):- X2 is X+1, Y2 is Y+1, dentro(X2,Y2).
vizinho(X,Y,X2,Y2,(b,e)):- X2 is X-1, Y2 is Y+1, dentro(X2,Y2).

%vizinhoN(?X,?Y,?X2,?Y2,?(Ver,Hor)).
vizinhoN(X,Y,X2,Y2,Dir):- 
	direccao(Dir,YDir,XDir),
	diag(XInc,YInc),
	(nonvar(X), nonvar(Y), X2 is X+XInc*XDir, Y2 is Y+YInc*YDir
	 ; nonvar(X2), nonvar(Y2), X is X2-XInc*XDir, Y is Y2-YInc*YDir),
	dentro(X,Y), dentro(X2,Y2).

%frente(?J,?X,?Y,?X2,?Y2,?Dir).
frente(1,X,Y,X2,Y2,(b,Hor)):- vizinho(X,Y,X2,Y2,(b,Hor)).
frente(2,X,Y,X2,Y2,(c,Hor)):- vizinho(X,Y,X2,Y2,(c,Hor)).

%directo(?X,?Y,?Xf,?Yf,?Dir,?Tab).
directo(X,Y,Xf,Yf,Dir,Tab):-
	vizinhoN(X,Y,Xf,Yf,Dir),
	livre(X,Y,Xf,Yf,Dir,Tab).

%livre(+Xi,+Yi,?Xf,?Yf,?Dir,+Tab).
livre(Xf,Yf,Xf,Yf,_,_).
livre(X,Y,Xf,Yf,Dir,Tab):- 
	vizinho(X,Y,X2,Y2,Dir),
	livre(X2,Y2,Tab),
	livre(X2,Y2,Xf,Yf,Dir,Tab).

%promocao(J,Pec,X,Y).
promocao(1,1,_,8).
promocao(2,2,_,1).

%troca(J,J2).
troca(1,2).
troca(2,1).

%tipo(?J,?Pec,?NPec).
tipo(1,p,1).
tipo(2,p,2).
tipo(1,d,3).
tipo(2,d,4).

%Ocupacao tabuleiro
livre(X,Y,Tab):- membrotab(0,X,Y,Tab).
peca(J,X,Y,Tab):- membrotab(J,X,Y,Tab).
dama(J,X,Y,Tab):- tipo(J,d,Pec), membrotab(Pec,X,Y,Tab).
pecaoudama(J,X,Y,Tab):- membrotab(Pec,X,Y,Tab), (Pec == J ; Pec is J+2).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%  VALIDACAO E EXECUCAO DE MOVIMENTOS  %%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Jogada ::= Peca-Tipo-(X,Y)-Lista-(Xf,Yf)  |  Peca-Tipo-(X,Y)-Lista-(Xf,Yf)
% Lista ::= {Peca Comida*Local Passagem)
% movimento_valido(J, ?Jogada, +Tabuleiro).

nao_obrigatorio(J, Pini, Tab):- 
	movimento_valido_aux(J, _-come-Pini-_, Tab), !, fail.
nao_obrigatorio(_,_,_).

movimento_valido(J, p-simp-(X,Y)-(Xf,Yf), Tab):-
	nao_obrigatorio(J,_,Tab),
	peca(J,X,Y,Tab),
	frente(J,X,Y,Xf,Yf,_),
	livre(Xf,Yf,Tab).
movimento_valido(J, d-simp-(X,Y)-(Xf,Yf), Tab):-
	nao_obrigatorio(J,_,Tab),
	dama(J,X,Y,Tab),
	directo(X,Y,Xf,Yf,_,Tab),
	livre(Xf,Yf,Tab).

movimento_valido(J, Pec-composto-Pos-[PCome*Pf], Tab):-
	movimento_valido_aux(J, Pec-come-Pos-[PCome*Pf], Tab),
	executa_jogada(J, Pec-come-Pos-[PCome*Pf], Tab, Tab2),
	nao_obrigatorio(J,Pf,Tab2).
movimento_valido(J, Pec-composto-Pos-[PCome*P2|Resto], Tab):-
	movimento_valido_aux(J, Pec-come-Pos-[PCome*P2], Tab),
	executa_jogada(J, Pec-come-Pos-[PCome*P2], Tab, Tab2),
	movimento_valido(J, Pec-composto-P2-Resto, Tab2).

movimento_valido_aux(J, p-come-(X,Y)-[(XCome,YCome)*(Xf,Yf)], Tab):-
	peca(J,X,Y,Tab),
	frente(J,X,Y,XCome,YCome,Dir),
	frente(J,XCome,YCome,Xf,Yf,Dir),
	troca(J,J2),
	pecaoudama(J2,XCome,YCome,Tab),
	livre(Xf,Yf,Tab).
movimento_valido_aux(J, d-come-(X,Y)-[(XCome,YCome)*(Xf,Yf)], Tab):-
	dama(J,X,Y,Tab), 
	(directo(X,Y,X2,Y2,Dir,Tab); X=X2, Y=Y2),
	vizinho(X2,Y2,XCome,YCome,Dir),
	troca(J,J2),
	pecaoudama(J2,XCome,YCome,Tab),
	directo(XCome,YCome,Xf,Yf,Dir,Tab).

%executa_jogada(+J, +Jogada, + Tabuleiro, -NovoTabuleiro).

executa_jogada(J, Peca-simp-(X,Y)-(Xf,Yf), Tab, NovoTab):-
	exec_move(J,Peca,X,Y,Xf,Yf,Tab,NovoTab).
executa_jogada(J, Peca-come-(X,Y)-[(X2,Y2)*(Xf,Yf)], Tab, NovoTab):-
	exec_move(J,Peca,X,Y,Xf,Yf,Tab,Tab2),
	exec_come(X2,Y2,Tab2,NovoTab).
executa_jogada(_, _-composto-(_,_)-[], Tab, Tab).
executa_jogada(J, Peca-composto-(X,Y)-[(X2,Y2)*(Xf,Yf)|Resto], Tab, NovoTab):-
	executa_jogada(J, Peca-come-(X,Y)-[(X2,Y2)*(Xf,Yf)], Tab, Tab2),
	executa_jogada(J, Peca-composto-(Xf,Yf)-Resto, Tab2, NovoTab).

exec_move(J,Pec,X,Y,Xf,Yf,Tab,NovoTab):-
	tipo(J,Pec,Num),
	if(promocao(J,Num,Xf,Yf), Num2 is Num+2, Num2=Num),
	muda_tab(Num,0, X,Y, Tab,Tab2),
	muda_tab(0,Num2, Xf,Yf, Tab2,NovoTab).   %Será boa ideia? Porque não fazer tudo junto?
exec_come(X,Y,Tab,NovoTab):-
	muda_tab(_,0, X,Y, Tab,NovoTab).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%  AVALIACAO DO ESTADO DO JOGO - TABULEIRO  %%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%avalia_tabuleiro(+J, +Tab, -Valor).
avalia_tabuleiro(J, Tab, Valor):-
	findall(Val, (membrotab(Pec,X,Y,Tab), valor(J,Pec,X,Y,Val)), Lista),
	sum_list(Lista, Valor).

valor(J,Pec,X,Y,Valor):-
	valorLoc(X,Y,ValLoc),
	valorPec(J,Pec,ValPec),
	Valor is ValLoc*ValPec.

valor( [[0,4,0,4,0,4,0,4],
	[4,0,3,0,3,0,3,0],
	[0,3,0,2,0,2,0,4],
	[4,0,2,0,1,0,3,0],
	[0,3,0,1,0,2,0,4],
	[4,0,2,0,4,0,3,0],
	[0,3,0,3,0,3,0,4],
	[4,0,4,0,4,0,4,0]]).

valorLoc(X,Y,Val):- valor(Lista), membrotab(Val,X,Y,Lista).
valorPec(1,1,1).
valorPec(1,2,-1).
valorPec(1,3,5).
valorPec(1,4,-5).
valorPec(2,Pec,Val2):- valorPec(1,Pec,Val1), Val2 is -Val1.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%  DETERMINACAO DO FINAL DO JOGO  %%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%fim_jogo(+J, +Tab, -Venc).
fim_jogo(J, Tab, _):- movimento_valido(J, _, Tab), !, fail.
fim_jogo(J, _, J2):- troca(J,J2).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%  CALCULO DA JOGADA DO COMPUTADOR  %%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

nivel(1).

%lista_jogadas(+J, +Tabuleiro, -ListaJogadas).
lista_jogadas(J, Tab, Lista):- 
	findall(J-Mov, movimento_valido(J,Mov,Tab), Lista).

sucessores(J, Tab, Lista):- 
	findall(NovoTab, 
			(movimento_valido(J,Mov,Tab), executa_jogada(J,Mov,Tab,NovoTab)),
		    Lista).

sucessores_ordenados(J, Tab, Lista):-
	findall(Val-Mov-NovoTab, 
			(movimento_valido(J,Mov,Tab), 
			 executa_jogada(J,Mov,Tab,NovoTab),
			 avalia_tabuleiro(J,NovoTab,Val)),
			L),
	keysort(L, L2), reverse(L2, Lista). 

%calcula_jogada(+Nível, +Jog, -Mov, +Tabuleiro).
calcula_jogada(0, J, Mov, Tab):- lista_jogadas(J, Tab, Lista),	Lista = [J-Mov|_].	%Aleatorio?
calcula_jogada(1, J, Mov, Tab):- sucessores_ordenados(J, Tab, Lista), Lista = [_-Mov-_|_].  %Guloso
%calcula_jogada(2, J, Mov, Tab):- alfaBeta(J, J, Tab, -10000, 10000, Mov, _, 0, 2).
%calcula_jogada(3, J, Mov, Tab):- alfaBeta(J, J, Tab, -10000, 10000, Mov, _, 0, 4).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%  MANIPULACAO DO ESTADO DO JOGO  %%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

membrotab(Pec,X,Y,Tab):-
	membro_pos_lista(Linha, Y, Tab),
	membro_pos_lista(Pec, X, Linha).

membro_pos_lista(Membro, N, Lista):-
	membro_pos_procura(Membro, 1, N, Lista).

membro_pos_procura(Membro, N, N, [Membro|_]).
membro_pos_procura(Membro, P, N, [_|T]):-
	P2 is P+1,
	membro_pos_procura(Membro, P2, N, T).

muda_tab(Peca,Pnov,X,Y,Tab,NovoTab):-
	muda_tab2(1,Peca,Pnov,X,Y,Tab,NovoTab),!.

muda_tab2(_,_,_,_,_,[],[]).
muda_tab2(Y,Peca,Pnov,X,Y,[Lin|Resto],[NovLin|Resto2]):-
	muda_linha(1,Peca,Pnov,X,Lin,NovLin),
	N2 is Y+1,
	muda_tab2(N2,Peca,Pnov,X,Y,Resto,Resto2).
muda_tab2(N,Peca,Pnov,X,Y,[Lin|Resto],[Lin|Resto2]):-
	N\=Y, N2 is N+1,
	muda_tab2(N2,Peca,Pnov,X,Y,Resto,Resto2).

muda_linha(_,_,_,_,[],[]).
muda_linha(X,Peca,Pnov,X,[Peca|Resto],[Pnov|Resto2]):-
	N2 is X+1,
	muda_linha(N2,Peca,Pnov,X,Resto,Resto2).
muda_linha(N,Peca,Pnov,X,[El|Resto],[El|Resto2]):-
	N\=X, N2 is N+1,
	muda_linha(N2,Peca,Pnov,X,Resto,Resto2).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%  VISUALIZACAO DO ESTADO DO JOGO - MODO DE TEXTO %%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%visualiza_estado(+Tabuleiro)
visualiza_estado(Tab):-
	nl, write('  A B C D E F G H'), nl,
	mostra_linhas(1,Tab),
	write('  A B C D E F G H'), nl,!.

mostra_linhas(_,[]).
mostra_linhas(N,[Lin|Resto]):-
	write(N), mostra_linha(Lin), write(' '), write(N), nl,
	N2 is N+1,
	mostra_linhas(N2, Resto).

mostra_linha([]).
mostra_linha([El|Resto]):-
	escreve(El),
	mostra_linha(Resto).

escreve(0):-write(' .').
escreve(1):-write(' o').
escreve(2):-write(' x').
escreve(3):-write(' O').
escreve(4):-write(' X').
escreve(8):-write(' #').

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%  TESTES DIVERSOS PARA DEBUG  %%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

t1(J,Mov):-estado_inicial(Tab), movimento_valido(J, Mov, Tab).
t2:- estado_inicial(Tab), X=5, Y=4, findall(X*Y-X2*Y2-Dir, livre(X,Y,X2,Y2,Dir,Tab), L), write(L).
t3:- X=5, Y=4, findall(X*Y-X2*Y2-Dir, vizinhoN(X,Y,X2,Y2,Dir), L), write(L).
t4:- estado_inicial(Tab), X=5, Y=4, findall(X*Y-X2*Y2-Dir, directo(X,Y,X2,Y2,Dir,Tab), L), write(L).
t5(J):- estado_inicial(Tab), sucessores_ordenados(J, Tab, Lista), write(Lista), 
	visualiza_estado(Tab), nl, mostra_suc(Lista).

mostra_suc([]).
mostra_suc([Val-Mov-Tab|Resto]):-
	write(Mov), write(' Val:'),write(Val),nl,
	visualiza_estado(Tab),nl,nl,
	mostra_suc(Resto).
/* estado_inicial(	
	[[8,0,8,0,8,0,8,0],
	[0,8,0,8,1,8,0,8],
	[8,0,8,0,8,0,8,0],
	[0,8,0,8,3,8,0,8],
	[8,0,8,2,8,0,8,0],
	[0,8,0,8,0,8,0,8],
	[8,2,8,0,8,0,8,0],
	[0,8,0,8,0,8,0,8]]). */

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
