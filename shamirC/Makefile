CC = clang
target = output
OBJDIR = build/
JAVA = build/
FLAGS =
$(JAVA)$(target): $(OBJDIR)main.o
	$(CC) $(OBJDIR)main.o -o $(JAVA)$(target) $(FLAGS)
$(OBJDIR)main.o: main.c $(OBJDIR)shamir.o
	$(CC) -c main.c -o $(OBJDIR)main.o
$(OBJDIR)shamir.o: shamir.c shamir.h $(OBJDIR)memzero.o
	$(CC) -c shamir.c -o $(OBJDIR)shamir.o
$(OBJDIR)memzero.o: memzero.c memzero.h
	$(CC) -c memzero.c -o $(OBJDIR)memzero.o
clean :
	rm  $(OBJDIR)*.o $(OBJDIR)output
