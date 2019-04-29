CC = emcc
target = output.js
OBJDIR = build/
JAVA = javascript/

$(JAVA)$(target): $(OBJDIR)main.o
	$(CC) $(OBJDIR)main.o -o $(JAVA)$(target)
$(OBJDIR)main.o: main.c $(OBJDIR)shamir.o
	$(CC) -c main.c -o $(OBJDIR)
$(OBJDIR)shamir.o: shamir.c shamir.h $(OBJDIR)memzero.o
	$(CC) -c shamir.c -o $(OBJDIR)
$(OBJDIR)memzero.o: memzero.c memzero.h
	$(CC) -c memzero.c -o $(OBJDIR)
clean :
	rm  $(JAVA)*.js $(JAVA)*.wasm $(OBJDIR)*.o
