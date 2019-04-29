CC = clang

output: main.o shamir.o
	$(CC) main.o -o output
main.o: main.c shamir.h
	$(CC) -c main.c
shamir.o: shamir.c shamir.h memzero.o
	$(CC) -c shamir.c
memzero.o: memzero.c memzero.h
	$(CC) -c memzero.c
clean :
	rm output *.o *.out
