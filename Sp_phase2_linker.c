#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE_LEN 100
#define MAX_LINK_ENTRIES 100
#define MAX_RELOCS 100
#define MAX_TOKENS 10

// Data Structures for Link Table and Relocation Table
struct LinkTableEntry {
    char symbol[20];
    char type[20];          // "public" or "external"
    int translatedAddress;
};

struct RelocationTableEntry {
    int address;
    int isRelocatable;
};

// Global variables for tables
struct LinkTableEntry linkTable[MAX_LINK_ENTRIES];
struct RelocationTableEntry relocationTable[MAX_RELOCS];
int linkCount = 0;
int relocationCount = 0;

// Function to split a string into tokens
int split(const char *str, char tokens[][20]) {
    int count = 0;
    char temp[MAX_LINE_LEN];
    strcpy(temp, str);
    char *token = strtok(temp, " \t");
    while (token != NULL && count < MAX_TOKENS) {
        strcpy(tokens[count], token);
        count++;
        token = strtok(NULL, " \t");
    }
    return count;
}

// Function to add an entry to the Link Table
void addLinkEntry(const char* symbol, const char* type, int address) {
    strcpy(linkTable[linkCount].symbol, symbol);
    strcpy(linkTable[linkCount].type, type);
    linkTable[linkCount].translatedAddress = address;
    linkCount++;
}

// Function to add entry to the Relocation Table
void addRelocationEntry(int address, int isRelocatable) {
    relocationTable[relocationCount].address = address;
    relocationTable[relocationCount].isRelocatable = isRelocatable;
    relocationCount++;
}

// Function to process each assembly line
void processAssemblyLine(const char* line, int* LC) {
    char tokens[MAX_TOKENS][20];
    int tokenCount = split(line, tokens);

    if (tokenCount == 0) return; // Skip empty lines

    // Handle START directive
    if (strcmp(tokens[0], "START") == 0) {
        *LC = atoi(tokens[1]);
        printf("(AD, 01) (C, %s)\n", tokens[1]);
        return;
    }

    // Handle END directive
    if (strcmp(tokens[0], "END") == 0) {
        printf("(AD, 02)\n");
        return;
    }

    // Handle DS directive as a public definition
    if (strcmp(tokens[1], "DS") == 0) {
        addLinkEntry(tokens[0], "public", *LC);
        printf("%d (DL, 01) (C, %s)\n", *LC, tokens[2]);
        *LC += atoi(tokens[2]); // Adjust location counter by size of DS
        return;
    }

    // Handle external references (e.g., labels not defined here)
    if (tokens[0][strlen(tokens[0]) - 1] == ':') {
        char label[20];
        strncpy(label, tokens[0], strlen(tokens[0]) - 1);
        label[strlen(tokens[0]) - 1] = '\0';

        // Add label as external reference in the Link Table
        addLinkEntry(label, "external", *LC);
    }

    // Handle other instructions, assuming each is relocatable
    printf("%d (IS, 01) (REG, %s) (C, %s)\n", *LC, tokens[1], tokens[2]);
    addRelocationEntry(*LC, 1);  // Mark the current LC as relocatable
    (*LC)++;
}

int main() {
    FILE *asmFile = fopen("alp.asm", "r");
    if (!asmFile) {
        printf("Unable to open the assembly file.\n");
        return 1;
    }

    int LC = 0;  // Location Counter
    char line[MAX_LINE_LEN];

    // User inputs the link origin
    int linkOrigin;
    printf("Enter the link origin: ");
    scanf("%d", &linkOrigin);

    printf("Intermediate Code:\n");
    while (fgets(line, MAX_LINE_LEN, asmFile) != NULL) {
        if (strlen(line) <= 1) continue;  // Skip empty lines
        processAssemblyLine(line, &LC);
    }
    
    fclose(asmFile);

    // Apply relocation based on the link origin and save to relocation_table.txt
    FILE *relocFile = fopen("relocation_table.txt", "w");
    if (!relocFile) {
        printf("Unable to create the relocation table file.\n");
        return 1;
    }

    fprintf(relocFile, "Relocation Table:\n");
    for (int i = 0; i < relocationCount; i++) {
        relocationTable[i].address += linkOrigin;  // Adjust addresses based on link origin
        fprintf(relocFile, "Address: %d\n", relocationTable[i].address);
    }
    fclose(relocFile);

    // Display the Link Table with adjusted addresses and save to link_table.txt
    FILE *linkFile = fopen("link_table.txt", "w");
    if (!linkFile) {
        printf("Unable to create the link table file.\n");
        return 1;
    }

    fprintf(linkFile, "Link Table:\n");
    for (int i = 0; i < linkCount; i++) {
        fprintf(linkFile, "Symbol: %s, Type: %s, Translated Address: %d\n",
                linkTable[i].symbol, linkTable[i].type, linkTable[i].translatedAddress + linkOrigin);
    }
    fclose(linkFile);

    printf("\nRelocation and Link tables have been saved to files.\n");

    return 0;
}
