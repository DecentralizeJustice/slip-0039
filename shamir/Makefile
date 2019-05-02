CC = emcc
target = output.js
OBJDIR = build/
JAVA = javascript/
FLAGS = -s EXPORTED_FUNCTIONS='["_main", "_shamirInterpolate"]'\
-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s SINGLE_FILE=1
$(JAVA)$(target): $(OBJDIR)main.o
	$(CC) $(OBJDIR)main.o -o $(JAVA)$(target) $(FLAGS)
$(OBJDIR)main.o: main.c $(OBJDIR)shamir.o
	$(CC) -c main.c -o $(OBJDIR)
$(OBJDIR)shamir.o: shamir.c shamir.h $(OBJDIR)memzero.o
	$(CC) -c shamir.c -o $(OBJDIR)
$(OBJDIR)memzero.o: memzero.c memzero.h
	$(CC) -c memzero.c -o $(OBJDIR)
clean :
	rm  $(JAVA)output.js $(JAVA)*.wasm $(OBJDIR)*.o
