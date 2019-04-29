CC = emcc
target = output.js

$(target): main.o
	$(CC) main.o -o $(target)
main.o: main.c shamir.o
	$(CC) -c main.c
shamir.o: shamir.c shamir.h memzero.o
	$(CC) -c shamir.c
memzero.o: memzero.c memzero.h
	$(CC) -c memzero.c
clean :
	rm output *.o *.out *.out.js *.out.wasm *.js *.wasm
