:- use_module(library(http/websocket)).
:- use_module(library(http/http_unix_daemon)).
:- use_module("ttt3.pl").

:- initialization http_daemon.

:- http_handler(root(.), http_upgrade_to_websocket(loop, []), [spawn([])]).

loop(Request) :-
  ws_receive(Request, Message, [format(json)]),
  strlist_terms(Message.data.state, State),
  findlegals(ttt3, State, Legals),
  legals_strlist(Legals, String),
  ws_send(Request, text(String)).

%% update_true(+Game, +State) is det
% needed put true(Proposition) in clausal store
update_true(Game, State) :-
  retractall(Game:true(_)), 
  forall(member(Proposition, State), assertz(Game:true(Proposition))).

findlegals(Game, State, Legals) :-
  update_true(Game, State),
  findall(legal(Role, Move), Game:legal(Role, Move), Unsorted),
  sort(Unsorted, Legals).

unquote_quote(Unquoted, Quoted) :-
  maplist(term_string, Unquoted, Quoted).

strlist_terms(StringList, Terms) :-
  maplist(unquote_quote, Listified, StringList),
  maplist(=.., Terms, Listified).

terms_strlist(Terms, String) :-
  maplist(=.., Terms, Listified),
  maplist(unquote_quote, Listified, Stringified),
  term_string(Stringified, String).

role_move(legal(Role, Move), ["does", StrRole, StrMove]) :-
  term_string(Role, StrRole),
  (  compound(Move)
  -> Move =.. Lst, unquote_quote(Lst, StrMove)
  ; term_string(Move, StrMove)
  ).

legals_strlist(Legals, String) :-
  maplist(role_move, Legals, StringList),
  term_string(StringList, String).


