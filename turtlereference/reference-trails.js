/* Small, cumulative projects. Every stop is an independent working program. */
(() => {
  const trails = [];
  const trail = (id, title, level, medium, description, skills, preview) => {
    const item = {id, title, level, medium, description, skills, preview, stops:[]};
    trails.push(item);
    return item;
  };
  const stop = (path, id, title, summary, syntax, code, expected, tryThis, watchFor, options = {}) => {
    path.stops.push({id, title, summary, syntax, code:code.trim()+'\n', expected, tryThis, watchFor,
      group:path.title, trail:path.id, level:path.level, output:path.medium === 'Turtle' ? 'drawing' : 'ascii',
      params:[], related:[], ...options});
  };

  const owl = trail('pocket-owl', 'Adopt a pocket owl', 'Beginner', 'ASCII',
    'Four lines become a little companion with a name, a friend, and a sleepy side.',
    'print → variables → a function → decisions',
    '  ,_,        ,_,\n (o,o)      (-,-)\n (   )      (   )\n  \' \'        \' \'\n  Pip        Moss');
  const owlFunction = `def owl(name, eyes):
    print(" ,_,")
    print("(" + eyes + ") " + name)
    print("(   )")
    print(" ' '")`;
  stop(owl, 'owl-meet', 'Meet Pip',
    'A comma becomes a beak. Parentheses become feathers. Run these four lines and meet your first pocket owl.',
    'print("(o,o)")',
    `print(" ,_,")
print("(o,o)")
print("(   )")
print(" ' '")`,
    'An owl in Text Output. Every space inside the quotes helps its face and body line up.',
    'Make one eye wink: change (o,o) to (o,-). Run again. Give it eyebrows if you like.',
    'The art lives inside quotation marks. Keep the spaces at the start of the top and bottom rows.',
    {related:['print','strings'], assertOutput:[' ,_,\n(o,o)\n(   )\n \' \'']});
  stop(owl, 'owl-name', 'A name and a face',
    'Keep the working owl. Store its name and eyes in variables so you can change its personality in one place.',
    'name = "Pip"\neyes = "o,o"',
    `name = "Pip"
eyes = "o,o"
print(" ,_,")
print("(" + eyes + ") " + name)
print("(   )")
print(" ' '")`,
    'The same owl, with Pip beside its face. The + signs join pieces of text.',
    'Rename Pip. Try eyes = "O,O" for a startled owl or "-,-" for a sleepy one.',
    'Keep three characters in the eyes string while experimenting so the face stays the same width.',
    {related:['variables','strings'], assertOutput:['(o,o) Pip']});
  stop(owl, 'owl-friends', 'Make room for a friend',
    'The owl already works. Move those four print lines into one function, then call it twice with different names and eyes.',
    'def owl(name, eyes):\n    ...\nowl("Pip", "o,o")',
    owlFunction+`\n\nowl("Pip", "o,o")
print()
owl("Moss", "-,-")`,
    'Pip is awake. Moss is asleep. One tested drawing makes both owls.',
    'Add owl("Bramble", "O,O") at the bottom. One new line gives the flock a third personality.',
    'Indent the four drawing lines inside the function. Put the calls back at the left edge.',
    {related:['functions','multiple-parameters'], assertOutput:['(o,o) Pip','(-,-) Moss']});
  stop(owl, 'owl-sleep', 'Let Pip get sleepy',
    'Now give the working owl a tiny rule: low energy closes its eyes. Change a number and watch its expression respond.',
    'if energy < 3:',
    owlFunction+`\n\nenergy = 2
if energy < 3:
    owl("Pip", "-,-")
    print("A warm pocket. A small snore.")
else:
    owl("Pip", "o,o")
    print("Pip is ready for the trail.")`,
    'At energy 2, Pip sleeps. At 3 or higher, Pip wakes up.',
    'Try 2, then 3. Add a message for your own owl. What would it dream about?',
    'The boundary is worth testing: < 3 includes 2 but excludes 3.',
    {related:['if','hud-fill'], assertOutput:['(-,-) Pip','A small snore.']});

  const hud = trail('camp-hud', 'Build the camp HUD', 'Beginner', 'ASCII',
    'Turn a row of marks into health, mana, and experience bars for an imaginary adventure.',
    'print → string repetition → a loop → a function',
    '== CAMP STATUS ==\nHP [########..] 17/20\nMP [####......]  4/10\nXP [#######...]  9/12\n\nRest here a moment.');
  stop(hud, 'hud-first', 'A bar you can read',
    'A heads-up display, or HUD, shows the state of a game. Start with two printed bars. A # is filled; a dot is empty.',
    'print("HP [######....] 6/10")',
    `print("== CAMP STATUS ==")
print("HP [######....] 6/10")
print("MP [####......] 4/10")
print("Rest here a moment.")`,
    'Two ten-slot bars. You can read how full they are before reading the numbers.',
    'Give the player one health point back. Change a dot to # and update 6/10 to 7/10.',
    'For now the picture and number are separate text. The next stop makes them agree automatically.',
    {related:['print'], assertOutput:['HP [######....] 6/10']});
  const hpCode = `health = 6
filled = "#" * health
empty = "." * (10 - health)
print("HP [" + filled + empty + "]", health, "/ 10")`;
  stop(hud, 'hud-fill', 'Let the number draw the bar',
    'Keep the bar. Replace the hand-typed marks with repeated strings, so one health value controls the whole display.',
    '"#" * health\n"." * (10 - health)', hpCode,
    'Six filled slots and four empty slots, calculated from health = 6.',
    'Try health values 0, 1, 9, and 10. Then try "█" and "░" as the filled and empty characters.',
    'This ten-slot version expects health from 0 to 10. The block characters are Unicode, a cousin of keyboard-only ASCII art.',
    {related:['strings','variables'], assertOutput:['HP [######....] 6 / 10']});
  stop(hud, 'hud-journey', 'A journey in four bars',
    'Your bar works for one value. Put the same drawing inside a loop to show a short history: full health, a scrape, a tumble, then a potion.',
    'for health in [10, 7, 4, 8]:',
    `print("DEPART -> SCRAPE -> TUMBLE -> POTION")
for health in [10, 7, 4, 8]:
    filled = "#" * health
    empty = "." * (10 - health)
    print("HP [" + filled + empty + "]", health, "/ 10")`,
    'Four bars tell a tiny story. The last bar recovers, but does not quite fill.',
    'Invent a five-stop journey by changing the list. Can the bars tell a story without extra words?',
    'All three lines that build and print the bar belong inside the loop.',
    {related:['for','lists'], assertOutput:['[##########]','[####......]','[########..]']});
  stop(hud, 'hud-dashboard', 'One function, a whole dashboard',
    'Wrap the tested bar in one function. Scale each value to ten display slots so health, mana, and experience can have different maximums.',
    'filled = int(value / maximum * 10)',
    `def meter(label, value, maximum):
    filled = int(value / maximum * 10)
    bar = "#" * filled + "." * (10 - filled)
    print(label + " [" + bar + "]", value, "/", maximum)

print("== CAMP STATUS ==")
meter("HP", 17, 20)
meter("MP", 4, 10)
meter("XP", 9, 12)
print("Rest here a moment.")`,
    'Three equal-width bars showing different fractions. int() drops the partial slot.',
    'Add a stamina bar. Give it its own maximum. Swap # for = and dots for spaces to design another style.',
    'Use a positive maximum and a value between zero and that maximum. Ten slots show an approximation; the numbers show the exact value.',
    {related:['functions','scaling','bag-pack'], assertOutput:['HP [########..] 17 / 20','XP [#######...] 9 / 12']});

  const bag = trail('trail-bag', 'Pack for an adventure', 'Beginner', 'ASCII',
    'A tiny bag becomes an inventory that can pick up a moonstone and travel with a friend.',
    'print → lists and loops → append → a function',
    ' .--------.\n | [ BAG ]|\n \'--------\'\n[1] rope\n[2] apple\n[3] lantern\n[4] moonstone');
  const bagArt = `print(" .--------.")
print(" | [ BAG ]|")
print(" '--------'")`;
  stop(bag, 'bag-pack', 'Three things for the road',
    'Start with a small bag and three printed items. Even a text inventory can have a recognizable little prop.',
    'print("[*] lantern")',
    bagArt+`\nprint("[*] rope")
print("[*] apple")
print("[*] lantern")`,
    'A bag with a rope, an apple, and a lantern underneath it.',
    'Replace one item with something your traveler would never leave behind.',
    'Print order is display order. Put the bag drawing above its contents.',
    {related:['print','strings'], assertOutput:['| [ BAG ]|','[*] lantern']});
  stop(bag, 'bag-list', 'A list carries the contents',
    'Keep the bag drawing. Replace the three separate item lines with a list and one loop.',
    'for item in bag:',
    `bag = ["rope", "apple", "lantern"]
`+bagArt+`\nfor item in bag:
    print("[*] " + item)`,
    'The same inventory. Its contents now live together in a Python list.',
    'Add "warm socks" to the list. You should not need another print line.',
    'Commas separate list items. Each item is its own quoted string.',
    {related:['lists','for'], assertOutput:['[*] rope','[*] apple','[*] lantern']});
  stop(bag, 'bag-loot', 'Something glints in the grass',
    'The inventory already works. Add one item before displaying it: a moonstone found beside the path.',
    'bag.append("moonstone")',
    `bag = ["rope", "apple", "lantern"]
bag.append("moonstone")
print("Found beside the path: a moonstone.")
`+bagArt+`\nfor item in bag:
    print("[*] " + item)
print("Slots:", len(bag), "/ 6")`,
    'Four items and a slot count of 4 / 6. append() adds to the end; len() counts what is there.',
    'Find another object. Add a second append() line and watch the slot count follow.',
    'The / 6 is a display label, not a capacity rule yet. Keep the bag at six items or fewer for this example.',
    {related:['list-append','list-length'], assertOutput:['[*] moonstone','Slots: 4 / 6']});
  stop(bag, 'bag-owner', 'A bag with somebody’s name on it',
    'Turn the working display into a function. enumerate() gives each item a slot number while the owner gets a label.',
    'for slot, item in enumerate(items, 1):',
    `def show_bag(owner, items):
    print(" .--------.")
    print(" | [ BAG ]|")
    print(" '--------'")
    print(owner + "'s belongings")
    for slot, item in enumerate(items, 1):
        print("[" + str(slot) + "] " + item)
    print("Slots:", len(items), "/ 6")

bag = ["rope", "apple", "lantern"]
bag.append("moonstone")
show_bag("Pip", bag)`,
    'Pip’s four numbered belongings. The same display can serve any owner and list.',
    'Make Moss a bag with two completely different items. Call show_bag() for Moss too.',
    'The 1 in enumerate(items, 1) makes human-friendly slot labels. It does not change Python’s zero-based list indexes.',
    {related:['enumerate','functions','owl-meet'], assertOutput:["Pip's belongings",'[4] moonstone']});

  const grove = trail('firefly-grove', 'Light a firefly grove', 'Medium', 'Turtle',
    'A single warm glow grows into a moonlit clearing, with a different scattering of fireflies for every seed.',
    'layers → a loop → a function → scenery → randomness',
    '       .       .\n    .       ( )\n        *\n   *         *\n       *   *\n____..____..____');
  const glow = `dot(60, "#193b43")
dot(30, "#527858")
dot(10, "#fff3aa")`;
  const firefly = `def firefly(size):
    dot(size * 6, "#193b43")
    dot(size * 3, "#527858")
    dot(size, "#fff3aa")`;
  const scenery = `# A moon, with a bite of sky over its right edge.
goto(95, 105)
dot(56, "#f5eac0")
goto(108, 112)
dot(52, "#101f2d")
# Rounded hills meet the bottom edge.
goto(65, -210)
dot(270, "#203d3b")
goto(-120, -215)
dot(260, "#2c4e40")`;
  stop(grove, 'grove-glow', 'One small light',
    'Three dots share a center. The large dark halo, smaller green glow, and warm middle make one firefly.',
    'dot(60, "#193b43")',
    `bgcolor("#101f2d")
${glow}
hideturtle()`,
    'One warm pinprick of light in a dark clearing. Later dots sit on top of earlier dots.',
    'Change the middle dot to pale turquoise. Give this firefly its own color.',
    'Draw from largest to smallest so the glow does not cover its bright center.',
    {related:['dot','bgcolor','ring']});
  stop(grove, 'grove-row', 'A string of little lights',
    'The glow works. Put the three dots in a loop and move after each one. No list of exact coordinates is needed.',
    'for light in range(5):',
    `bgcolor("#101f2d")
penup()
backward(120)
for light in range(5):
    dot(60, "#193b43")
    dot(30, "#527858")
    dot(10, "#fff3aa")
    forward(60)
hideturtle()`,
    'Five glows spaced evenly across the night.',
    'Bring the lights closer together. What happens when their halos overlap?',
    'Keep the pen lifted for the movement, or the fireflies will be joined by a line.',
    {related:['for','penup','forward']});
  stop(grove, 'grove-sizes', 'A glow worth reusing',
    'Move the tested three-dot glow into one function. A size parameter makes a family of small and large lights.',
    'def firefly(size):',
    `bgcolor("#101f2d")
${firefly}

penup()
backward(120)
for size in [5, 9, 6, 11, 4]:
    firefly(size)
    forward(60)
hideturtle()`,
    'Five related glows, each a different size. One number scales all three layers.',
    'Make the smallest light sit between the two largest. Change only the list.',
    'Calling the function draws the glow. Defining it prepares the recipe.',
    {related:['functions','parameters','scaling']});
  stop(grove, 'grove-place', 'Give the light a home',
    'Keep the firefly function. Add a crescent moon and two rounded hills, then call the function in the clearing.',
    'Draw the backdrop first. Add the light afterward.',
    `bgcolor("#101f2d")
${firefly}

penup()
${scenery}
goto(0, 0)
firefly(8)
hideturtle()`,
    'A crescent above layered hills, with one firefly between them. The hills continue beyond the bottom edge.',
    'Slide the dark dot over the moon a little farther to the right to make a wider crescent.',
    'The moon is two overlapping dots. The covering dot must use the sky color.',
    {related:['ring','goto']});
  stop(grove, 'grove-night', 'A clearing full of fireflies',
    'The scene works with one light. Replace that one call with a loop that chooses a place and size for each firefly.',
    'random.seed(7)\nrandom.randint(-155, 155)',
    `import random
random.seed(7)
bgcolor("#101f2d")
${firefly}

penup()
${scenery}
for light in range(14):
    x = random.randint(-155, 155)
    y = random.randint(-65, 70)
    goto(x, y)
    firefly(random.choice([3, 4, 5]))
hideturtle()`,
    'Fourteen fireflies scattered through a moonlit grove. Running seed 7 again brings back the same night.',
    'Try seed 8, 9, or your favorite number. Keep the night you like. Try fewer lights and notice the empty space.',
    'Random values choose the details inside the bounds you set. A seed makes a particular arrangement reproducible.',
    {related:['random-seed','random','click-flower']});

  const potion = trail('pixel-potion', 'Brew a pixel potion', 'Medium', 'ASCII + Turtle',
    'Print a bottle, learn one square tile, then turn the same character map into a tiny potion shop.',
    'text rows → a pixel → a row → nested loops → a function',
    '   ###       ###\n   #.#       #.#\n  ##.##     ##.##\n #.....#   #.....#\n #.....#   #.....#\n #~~~~~#   #~~~~~#\n #~~~~~#   #~~~~~#\n  #####     #####');
  const bottleRows = ['   ###   ','   #.#   ','  ##.##  ',' #.....# ',' #.....# ',' #~~~~~# ',' #~~~~~# ','  #####  '];
  const bottleList = 'bottle = [\n'+bottleRows.map(row=>'    "'+row+'",').join('\n')+'\n]';
  const palette = 'palette = {"#": "#b4cfcb", ".": "#203c49", "~": "orchid"}';
  const pixel = `begin_fill()
for side in range(4):
    forward(20)
    right(90)
end_fill()`;
  const rowCode = `for symbol in row:
    if symbol != " ":
        color(palette[symbol])
        pendown()
        begin_fill()
        for side in range(4):
            forward(20)
            right(90)
        end_fill()
        penup()
    forward(20)`;
  stop(potion, 'potion-text', 'A bottle made of characters',
    'Each printed row is a strip of the picture. # is glass, dots are the empty bottle, and ~ is potion.',
    'print(" #~~~~~# ")',
    bottleRows.map(row=>'print("'+row+'")').join('\n'),
    'A stoppered bottle with two rows of potion at the bottom.',
    'Fill the bottle a little higher: change one middle row of dots to ~ marks.',
    'The spaces outside the bottle are part of its silhouette. Keep each row nine characters wide.',
    {related:['print','strings'], assertOutput:['   ###   ',' #~~~~~# ']});
  stop(potion, 'potion-map', 'Keep the picture in a list',
    'Store the working rows together and let a loop print them. This list will become the picture data for the colored bottle.',
    'for row in bottle:\n    print(row)',
    bottleList+'\nfor row in bottle:\n    print(row)',
    'The same bottle, now stored as a list of rows.',
    'Make a second version with a different liquid level. Run after changing one row.',
    'Changing how the picture is stored does not have to change how it looks.',
    {related:['lists','for'], assertOutput:['  ##.##  ','  #####  ']});
  stop(potion, 'potion-pixel', 'Try one colored tile',
    'Before drawing the whole bottle in Turtle, test one square. This will replace a single character in the map.',
    'for side in range(4):\n    forward(20)\n    right(90)',
    `bgcolor("#101f2d")
color("orchid")
${pixel}
hideturtle()`,
    'One small purple square. It ends where it began, facing the same way.',
    'Temporarily make the tile 60 pixels wide to inspect it. Return it to 20 before the next stop.',
    'The fill wraps around the complete square. Four right turns bring the heading back to its start.',
    {output:'drawing', related:['fill','for']});
  stop(potion, 'potion-row', 'Color one row of the bottle',
    'The tile works. Walk across one row, choosing a color for each character and leaving spaces empty.',
    'color(palette[symbol])',
    `bgcolor("#101f2d")
${palette}
row = " #~~~~~# "
penup()
backward(90)
${rowCode}
hideturtle()`,
    'A purple strip between two pale glass tiles. It is one row of the eventual bottle.',
    'Change orchid to skyblue in the palette. One edit recolors every liquid tile.',
    'A dictionary connects each symbol to its color. A blank space skips drawing but still moves forward.',
    {output:'drawing', related:['dictionary','for','color']});
  const allRows = `for row in bottle:
${rowCode.split('\n').map(line=>'    '+line).join('\n')}
    backward(len(row) * 20)
    right(90)
    forward(20)
    left(90)`;
  stop(potion, 'potion-bottle', 'Stack the rows into a potion',
    'The colored row works. Add an outer loop: draw a row, return to its start, move down one tile, and draw the next.',
    'for row in bottle:\n    for symbol in row:',
    `speed(0)
bgcolor("#101f2d")
${bottleList}
${palette}
penup()
backward(90)
left(90)
forward(80)
right(90)
${allRows}
hideturtle()`,
    'The complete colored bottle, built from the exact character map you printed earlier.',
    'Change a dot to ~ in the map and run again. The matching glass tile becomes liquid.',
    'The return distance is the row length times the tile width. That keeps the rows lined up without typing pixel coordinates.',
    {output:'drawing', related:['nested','list-length']});
  stop(potion, 'potion-shop', 'Open a two-bottle potion shop',
    'Your bottle renderer works. Wrap it in one function and pass in the liquid color. Draw two bottles from the same map.',
    'def draw_potion(liquid):',
    `speed(0)
bgcolor("#101f2d")
${bottleList}

def draw_potion(liquid):
    palette = {"#": "#b4cfcb", ".": "#203c49", "~": liquid}
${allRows.replaceAll('20','16').split('\n').map(line=>'    '+line).join('\n')}

penup()
goto(-165, 80)
draw_potion("orchid")
goto(-93, -85)
color("#d3e4da")
write("DREAM", align="center", font=("monospace", 12))
goto(15, 80)
draw_potion("skyblue")
goto(87, -85)
color("#d3e4da")
write("MANA", align="center", font=("monospace", 12))
hideturtle()`,
    'Two labeled potions, one purple and one blue. Only their starting places and colors differ.',
    'Invent a potion and name it. Try changing the map into a mushroom, heart, or tiny sword using the same three symbols.',
    'Each call starts at the bottle’s top-left corner. Keep the pen lifted when moving between bottles and labels.',
    {output:'drawing', related:['functions','parameters','write']});

  const dungeon = trail('tiny-dungeon', 'Map a tiny dungeon', 'Hard', 'ASCII',
    'A seven-line room becomes a route you can edit, with walls that stop you and treasure that stays collected.',
    'rows → indexes → rendering → collision → routes → state',
    '+---------+\n|@....$...|\n|.###.....|\n|.....#...|\n|..!..#...|\n|.........|\n+---------+\n@ you   $ coin   ! potion');
  const roomRows = ['+---------+','|.....$...|','|.###.....|','|.....#...|','|..!..#...|','|.........|','+---------+'];
  const roomList = 'dungeon = [\n'+roomRows.map(row=>'    "'+row+'",').join('\n')+'\n]';
  const renderMap = `for row_number, tiles in enumerate(dungeon):
    line = ""
    for column, tile in enumerate(tiles):
        if row_number == player_row and column == player_column:
            line += "@"
        else:
            line += tile
    print(line)`;
  const mapFunction = 'def draw_map(player_row, player_column):\n'+renderMap.split('\n').map(line=>'    '+line).join('\n');
  stop(dungeon, 'dungeon-room', 'A room with a story in it',
    'A room needs very few marks: walls, floor, an explorer, and something worth finding. Start with a working printed map.',
    'print("|@....$...|")',
    roomRows.map((row,i)=>'print("'+(i===1?'|@....$...|':row)+'")').join('\n')+'\nprint("@ you   $ coin   ! potion")',
    'An explorer in the top-left corridor, a coin to the right, and a potion in the lower room.',
    'Replace a floor dot with #. Make a little alcove. Leave a path from the explorer to the coin.',
    'Every row is eleven characters wide. The border closes the room.',
    {related:['print','strings'], assertOutput:['|@....$...|','@ you   $ coin   ! potion']});
  stop(dungeon, 'dungeon-rows', 'Store the room, place the explorer',
    'Move the map into a list. Keep the player’s row and column separate so the explorer can move without rewriting the whole picture.',
    'if row_number == player_row and column == player_column:',
    roomList+`\nplayer_row = 1
player_column = 1
${renderMap}`,
    'The same map. @ is drawn over the floor at row 1, column 1. The stored floor remains a dot.',
    'Try player_column = 2, then 3. Keep the row at 1. Where is column zero?',
    'Indexes start at zero, including the border. This renderer places the player; it does not check walls yet.',
    {related:['enumerate','nested','list-index'], assertOutput:['|@....$...|']});
  stop(dungeon, 'dungeon-wall', 'A wall gets a vote',
    'Wrap the working map printer in a function. Before moving downward, inspect the destination. A wall leaves the explorer in place.',
    'if dungeon[next_row][player_column] in "#|+-":',
    roomList+'\n\n'+mapFunction+`\n\nplayer_row = 1
player_column = 2
next_row = player_row + 1
if dungeon[next_row][player_column] in "#|+-":
    print("A wall. Try another way.")
else:
    player_row = next_row
draw_map(player_row, player_column)`,
    'The wall below column 2 blocks the step. The explorer remains in the top corridor.',
    'Set player_column to 1. The downward step now reaches open floor.',
    'This first movement test stays inside the room. The next stop adds a bounds check for longer routes.',
    {related:['functions','if','list-index'], assertOutput:['A wall. Try another way.','|.@...$...|']});
  const routeStart = `player_row = 1
player_column = 1
moves = {"w": (-1, 0), "s": (1, 0), "a": (0, -1), "d": (0, 1)}
route = "sddwddddd"`;
  const walk = `for move in route:
    if move not in moves:
        continue
    down, across = moves[move]
    next_row = player_row + down
    next_column = player_column + across
    if not (0 <= next_row < len(dungeon) and 0 <= next_column < len(dungeon[0])):
        continue
    tile = dungeon[next_row][next_column]
    if tile in "#|+-":
        print("Bump. A wall blocks", move)
        continue
    player_row = next_row
    player_column = next_column`;
  stop(dungeon, 'dungeon-route', 'Walk a route',
    'One guarded move works. Repeat that check for each letter of a route: w up, a left, s down, d right. The sample deliberately bumps into a wall before going around it.',
    'for move in route:',
    roomList+'\n\n'+mapFunction+'\n\n'+routeStart+'\n'+walk+'\n\ndraw_map(player_row, player_column)',
    'Two blocked right steps, then a return to the top corridor and a walk onto the coin. @ temporarily covers the coin.',
    'Try route = "ddddd". Then add an a to step off the coin. Notice that it is still there.',
    'continue skips to the next route letter. Bounds and wall checks happen before changing the player’s position.',
    {related:['dictionary','for','if'], assertOutput:['Bump. A wall blocks d','|.....@...|']});
  stop(dungeon, 'dungeon-coin', 'A coin that stays collected',
    'Movement works. After a successful step onto $, replace that tile with floor and increase the coin count. Now the room remembers what happened.',
    'tiles[:player_column] + "." + tiles[player_column + 1:]',
    roomList+'\n\n'+mapFunction+'\n\n'+routeStart.replace('sddwddddd','ddddda')+'\ncoins = 0\n'+walk+`
    if tile == "$":
        coins += 1
        tiles = dungeon[player_row]
        dungeon[player_row] = tiles[:player_column] + "." + tiles[player_column + 1:]
        print("Found a moon coin. It feels warm.")

draw_map(player_row, player_column)
print("Coins:", coins)`,
    'The explorer collects the coin, then steps left. Its old square is empty and the counter reads 1.',
    'Use "dddddada" to step on and off the old coin square twice. You should still have exactly one coin.',
    'Strings cannot be changed one character at a time. Slices build a replacement row from the part before the tile, a dot, and the part after it.',
    {related:['strings','augmented-assignment'], assertOutput:['Found a moon coin. It feels warm.','|....@....|','Coins: 1']});
  stop(dungeon, 'dungeon-camp', 'Leave a little gift in the room',
    'You have a map, movement, walls, and a collectible. Give the existing ! tile a purpose: collecting it restores health, and the room remembers that too.',
    'if tile == "!":\n    health = min(10, health + 4)',
    roomList+'\n\n'+mapFunction+'\n\n'+routeStart.replace('sddwddddd','sssdd')+'\nhealth = 3\n'+walk+`
    if tile == "!":
        health = min(10, health + 4)
        tiles = dungeon[player_row]
        dungeon[player_row] = tiles[:player_column] + "." + tiles[player_column + 1:]
        print("A potion tucked behind the wall. +4 HP")

draw_map(player_row, player_column)
print("HP [" + "#" * health + "." * (10 - health) + "]", health, "/ 10")`,
    'A route to the lower room finds the potion. Health rises from 3 to 7, shown in a familiar ten-slot bar.',
    'Add an a to the route so you can see the empty potion square. Invent a message that makes this room feel lived in.',
    'This variation builds on the pickup rule from the last stop. min(10, ...) prevents a potion from overfilling the health bar.',
    {related:['hud-fill','bag-loot'], assertOutput:['+4 HP','HP [#######...] 7 / 10']});

  const strange_garden = trail("strange-garden", "Grow a strange garden", "Beginner", "Turtle", "Build a leafy flower, move it, save a recipe, then grow a colorful flowerbed.", "color \u2192 position \u2192 functions \u2192 loops \u2192 lists \u2192 random choices", "");
  stop(strange_garden, "garden-flower", "Build one flower from petals", "Start with one flower: a stem, two leaves, four petals, and a contrasting center. Change only the petal color today.", "shade = \"#c17eb5\"", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\nx = 0\nshade = \"#c17eb5\"\n# Stem and two leaves.\ncolor(\"#42785c\")\npensize(4)\ngoto(x, -95)\npendown()\ngoto(x, 0)\npenup()\ngoto(x - 10, -55)\ndot(22, \"#609b6d\")\ngoto(x + 10, -38)\ndot(22, \"#609b6d\")\n# Four petals surround a contrasting center.\ngoto(x - 16, 0)\ndot(30, shade)\ngoto(x + 16, 0)\ndot(30, shade)\ngoto(x, -16)\ndot(30, shade)\ngoto(x, 16)\ndot(30, shade)\ngoto(x, 0)\ndot(19, \"#f4c65b\")\ndot(7, \"#775139\")", "One four-petal purple flower with two green leaves and a gold center.", "Change shade to \"#e58b70\". Which dots keep their original colors?", "The four outer dots share shade; the center and leaves use their own colors.", {"related": ["dot", "variables"], "draftVersion": 2});
  stop(strange_garden, "garden-position", "Move the whole flower", "Keep the flower. Every horizontal position is written relative to x, so changing x moves the whole plant together.", "x = -90", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\nx = -90\nshade = \"#c17eb5\"\n# Stem and two leaves.\ncolor(\"#42785c\")\npensize(4)\ngoto(x, -95)\npendown()\ngoto(x, 0)\npenup()\ngoto(x - 10, -55)\ndot(22, \"#609b6d\")\ngoto(x + 10, -38)\ndot(22, \"#609b6d\")\n# Four petals surround a contrasting center.\ngoto(x - 16, 0)\ndot(30, shade)\ngoto(x + 16, 0)\ndot(30, shade)\ngoto(x, -16)\ndot(30, shade)\ngoto(x, 16)\ndot(30, shade)\ngoto(x, 0)\ndot(19, \"#f4c65b\")\ndot(7, \"#775139\")", "The complete flower moves to the left side of the drawing.", "Set x to 90. Predict which way it moves.", "x - 16 places a petal left of the stem. x + 16 places one right of it.", {"related": ["variables", "goto"], "draftVersion": 2});
  stop(strange_garden, "garden-function", "Make a reusable flower recipe", "The flower already uses x and shade. Turn those two variables into function inputs, then call the recipe twice.", "def flower(x, shade):", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\ndef flower(x, shade):\n    # Stem and two leaves.\n    color(\"#42785c\")\n    pensize(4)\n    goto(x, -95)\n    pendown()\n    goto(x, 0)\n    penup()\n    goto(x - 10, -55)\n    dot(22, \"#609b6d\")\n    goto(x + 10, -38)\n    dot(22, \"#609b6d\")\n    # Four petals surround a contrasting center.\n    goto(x - 16, 0)\n    dot(30, shade)\n    goto(x + 16, 0)\n    dot(30, shade)\n    goto(x, -16)\n    dot(30, shade)\n    goto(x, 16)\n    dot(30, shade)\n    goto(x, 0)\n    dot(19, \"#f4c65b\")\n    dot(7, \"#775139\")\n\nflower(-80, \"#c17eb5\")\nflower(80, \"#e58b70\")", "Two leafy flowers: purple on the left, coral on the right.", "Add flower(0, \"#7caecb\") at the bottom.", "Calls start at the left edge. The indented drawing belongs to the function.", {"related": ["functions", "multiple-parameters"], "draftVersion": 2});
  stop(strange_garden, "garden-row", "Repeat the recipe across a bed", "Keep the function. A loop supplies five x positions, calling the same recipe at each one.", "for x in [-140, -70, 0, 70, 140]:", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\ndef flower(x, shade):\n    # Stem and two leaves.\n    color(\"#42785c\")\n    pensize(4)\n    goto(x, -95)\n    pendown()\n    goto(x, 0)\n    penup()\n    goto(x - 10, -55)\n    dot(22, \"#609b6d\")\n    goto(x + 10, -38)\n    dot(22, \"#609b6d\")\n    # Four petals surround a contrasting center.\n    goto(x - 16, 0)\n    dot(30, shade)\n    goto(x + 16, 0)\n    dot(30, shade)\n    goto(x, -16)\n    dot(30, shade)\n    goto(x, 16)\n    dot(30, shade)\n    goto(x, 0)\n    dot(19, \"#f4c65b\")\n    dot(7, \"#775139\")\n\nfor x in [-140, -70, 0, 70, 140]:\n    flower(x, \"#c17eb5\")", "Five matching purple flowers across one bed.", "Remove 0 from the list. Predict where the gap will be.", "The list explicitly names every horizontal position; the loop visits them in order.", {"related": ["for", "lists"], "draftVersion": 2});
  stop(strange_garden, "garden-palette", "Choose from a small palette", "Keep the five positions. Store three colors in a list. For now, use shades[0] to choose its first color for every flower.", "shades[0]", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\ndef flower(x, shade):\n    # Stem and two leaves.\n    color(\"#42785c\")\n    pensize(4)\n    goto(x, -95)\n    pendown()\n    goto(x, 0)\n    penup()\n    goto(x - 10, -55)\n    dot(22, \"#609b6d\")\n    goto(x + 10, -38)\n    dot(22, \"#609b6d\")\n    # Four petals surround a contrasting center.\n    goto(x - 16, 0)\n    dot(30, shade)\n    goto(x + 16, 0)\n    dot(30, shade)\n    goto(x, -16)\n    dot(30, shade)\n    goto(x, 16)\n    dot(30, shade)\n    goto(x, 0)\n    dot(19, \"#f4c65b\")\n    dot(7, \"#775139\")\n\nshades = [\"#c17eb5\", \"#e58b70\", \"#7caecb\"]\nfor x in [-140, -70, 0, 70, 140]:\n    flower(x, shades[0])", "Five purple flowers, all using the first color in the palette.", "Change shades[0] to shades[1], then shades[2].", "List positions start at zero. This three-color list has indexes 0, 1, and 2.", {"related": ["lists", "list-index"], "draftVersion": 2});
  stop(strange_garden, "garden-colors", "Let each bloom pick a color", "Keep the palette and row. Replace the fixed shades[0] choice with random.choice(shades), so each flower can pick its own color.", "random.choice(shades)", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\nimport random\n\ndef flower(x, shade):\n    # Stem and two leaves.\n    color(\"#42785c\")\n    pensize(4)\n    goto(x, -95)\n    pendown()\n    goto(x, 0)\n    penup()\n    goto(x - 10, -55)\n    dot(22, \"#609b6d\")\n    goto(x + 10, -38)\n    dot(22, \"#609b6d\")\n    # Four petals surround a contrasting center.\n    goto(x - 16, 0)\n    dot(30, shade)\n    goto(x + 16, 0)\n    dot(30, shade)\n    goto(x, -16)\n    dot(30, shade)\n    goto(x, 16)\n    dot(30, shade)\n    goto(x, 0)\n    dot(19, \"#f4c65b\")\n    dot(7, \"#775139\")\n\nshades = [\"#c17eb5\", \"#e58b70\", \"#7caecb\"]\nfor x in [-140, -70, 0, 70, 140]:\n    flower(x, random.choice(shades))", "Five flowers, each choosing purple, coral, or blue. Colors may repeat.", "Run twice. Which parts change, and which stay in the same places?", "import random provides choice. Random choices can repeat; you may not see all three colors in every run.", {"related": ["random", "lists"], "draftVersion": 2});
  stop(strange_garden, "garden-wild", "Give the flowerbed a home", "Keep the palette, loop, and flower recipe. Add a filled patch of grass before the loop, so the plants sit in front of it. This final stop changes the scene, using commands you already know.", "begin_fill()", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\nimport random\n\ndef flower(x, shade):\n    # Stem and two leaves.\n    color(\"#42785c\")\n    pensize(4)\n    goto(x, -95)\n    pendown()\n    goto(x, 0)\n    penup()\n    goto(x - 10, -55)\n    dot(22, \"#609b6d\")\n    goto(x + 10, -38)\n    dot(22, \"#609b6d\")\n    # Four petals surround a contrasting center.\n    goto(x - 16, 0)\n    dot(30, shade)\n    goto(x + 16, 0)\n    dot(30, shade)\n    goto(x, -16)\n    dot(30, shade)\n    goto(x, 16)\n    dot(30, shade)\n    goto(x, 0)\n    dot(19, \"#f4c65b\")\n    dot(7, \"#775139\")\n\nshades = [\"#c17eb5\", \"#e58b70\", \"#7caecb\"]\n# A patch of grass behind the flowers.\ncolor(\"#e3ecd1\")\ngoto(-190, -130)\nbegin_fill()\npendown()\ngoto(190, -130)\ngoto(190, -85)\ngoto(-190, -85)\ngoto(-190, -130)\nend_fill()\npenup()\n\nfor x in [-140, -70, 0, 70, 140]:\n    flower(x, random.choice(shades))", "A row of five leafy flowers grows in a pale green bed.", "Change the grass color from \"#e3ecd1\" to \"#dfc9aa\" for a sandy garden.", "Drawing order is like paper layers: the bed goes down first, then the flowers.", {"related": ["fill", "for"], "draftVersion": 2});
  const tiny_dragon = trail("tiny-dragon", "Raise a tiny dragon", "Medium", "Turtle", "Draw a winged hatchling, save its recipe, give it a mood, then teach it to respond to snacks.", "drawing \u2192 a function \u2192 decisions \u2192 energy \u2192 click events", "");
  stop(tiny_dragon, "dragon-meet", "A hatchling with a tail", "Start with a complete hatchling. Follow the comments to find its tail, feet, body, head, and eye. Today, change just its body color.", "shade = \"#58a77a\"", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\nshade = \"#58a77a\"\n# Tail: draw behind the body.\ncolor(\"#294b42\")\npensize(24)\ngoto(-55, -52)\npendown()\ngoto(-102, -57)\ngoto(-133, -32)\ngoto(-143, -4)\npenup()\ncolor(shade)\npensize(16)\ngoto(-55, -52)\npendown()\ngoto(-102, -57)\ngoto(-133, -32)\ngoto(-143, -4)\npenup()\ncolor('#e8b454')\ngoto(-143, 14)\nbegin_fill()\npendown()\ngoto(-158, -6)\ngoto(-140, -17)\ngoto(-128, -3)\ngoto(-143, 14)\nend_fill()\npenup()\n# Feet, body, and warm belly.\ngoto(-52, -98)\ndot(40, \"#294b42\")\ndot(34, shade)\ngoto(20, -98)\ndot(40, \"#294b42\")\ndot(34, shade)\ngoto(-22, -38)\ndot(126, \"#294b42\")\ndot(120, shade)\ngoto(-8, -47)\ndot(73, \"#d6e8af\")\n# Head and rounded snout.\ngoto(38, 46)\ndot(90, \"#294b42\")\ndot(84, shade)\ngoto(76, 27)\ndot(63, \"#294b42\")\ndot(57, shade)\ncolor('#e8b454')\ngoto(12, 83)\nbegin_fill()\npendown()\ngoto(12, 118)\ngoto(32, 87)\ngoto(12, 83)\nend_fill()\npenup()\ncolor('#e8b454')\ngoto(53, 86)\nbegin_fill()\npendown()\ngoto(69, 116)\ngoto(70, 80)\ngoto(53, 86)\nend_fill()\npenup()\ngoto(93, 37)\ndot(5, \"#294b42\")\ncolor(\"#294b42\")\npensize(3)\ngoto(64, 13)\npendown()\ngoto(96, 13)\npenup()\ngoto(46, 61)\ndot(19, \"white\")\ngoto(49, 61)\ndot(10, \"#294b42\")\ngoto(51, 64)\ndot(3, \"white\")\n", "A green hatchling with a curling tail, gold horns, two feet, and a bright eye.", "Change shade to \"#5c9fc4\". Which parts change together?", "The dark dots behind the colored dots make outlines. The gold horns and pale belly keep their own colors.", {"related": ["variables", "dot"], "draftVersion": 2});
  stop(tiny_dragon, "dragon-wings", "Give it a folded wing", "Keep the hatchling. Add one filled wing before the body is drawn, so the body covers its lower edge.", "begin_fill()", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\nshade = \"#58a77a\"\ncolor('#7964a3')\ngoto(-50, 0)\nbegin_fill()\npendown()\ngoto(-112, 64)\ngoto(-92, 118)\ngoto(-56, 80)\ngoto(-28, 18)\ngoto(-50, 0)\nend_fill()\npenup()\ncolor('#c0a7cf')\ngoto(-54, 16)\nbegin_fill()\npendown()\ngoto(-98, 66)\ngoto(-88, 97)\ngoto(-65, 71)\ngoto(-54, 16)\nend_fill()\npenup()\n# Tail: draw behind the body.\ncolor(\"#294b42\")\npensize(24)\ngoto(-55, -52)\npendown()\ngoto(-102, -57)\ngoto(-133, -32)\ngoto(-143, -4)\npenup()\ncolor(shade)\npensize(16)\ngoto(-55, -52)\npendown()\ngoto(-102, -57)\ngoto(-133, -32)\ngoto(-143, -4)\npenup()\ncolor('#e8b454')\ngoto(-143, 14)\nbegin_fill()\npendown()\ngoto(-158, -6)\ngoto(-140, -17)\ngoto(-128, -3)\ngoto(-143, 14)\nend_fill()\npenup()\n# Feet, body, and warm belly.\ngoto(-52, -98)\ndot(40, \"#294b42\")\ndot(34, shade)\ngoto(20, -98)\ndot(40, \"#294b42\")\ndot(34, shade)\ngoto(-22, -38)\ndot(126, \"#294b42\")\ndot(120, shade)\ngoto(-8, -47)\ndot(73, \"#d6e8af\")\n# Head and rounded snout.\ngoto(38, 46)\ndot(90, \"#294b42\")\ndot(84, shade)\ngoto(76, 27)\ndot(63, \"#294b42\")\ndot(57, shade)\ncolor('#e8b454')\ngoto(12, 83)\nbegin_fill()\npendown()\ngoto(12, 118)\ngoto(32, 87)\ngoto(12, 83)\nend_fill()\npenup()\ncolor('#e8b454')\ngoto(53, 86)\nbegin_fill()\npendown()\ngoto(69, 116)\ngoto(70, 80)\ngoto(53, 86)\nend_fill()\npenup()\ngoto(93, 37)\ndot(5, \"#294b42\")\ncolor(\"#294b42\")\npensize(3)\ngoto(64, 13)\npendown()\ngoto(96, 13)\npenup()\ngoto(46, 61)\ndot(19, \"white\")\ngoto(49, 61)\ndot(10, \"#294b42\")\ngoto(51, 64)\ndot(3, \"white\")\n", "The same hatchling, now with a purple wing rising behind its back.", "Change the wing tip from (-92, 118) to (-112, 138). Predict how its silhouette changes.", "A filled shape joins its corner coordinates. Drawing the wing first puts it behind the body.", {"related": ["fill", "goto"], "draftVersion": 2});
  stop(tiny_dragon, "dragon-recipe", "Save the dragon as a recipe", "The drawing already works. Indent it beneath def dragon(shade), then call the recipe with a color. Defining the recipe alone draws nothing.", "def dragon(shade):", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\ndef dragon(shade):\n    color('#7964a3')\n    goto(-50, 0)\n    begin_fill()\n    pendown()\n    goto(-112, 64)\n    goto(-92, 118)\n    goto(-56, 80)\n    goto(-28, 18)\n    goto(-50, 0)\n    end_fill()\n    penup()\n    color('#c0a7cf')\n    goto(-54, 16)\n    begin_fill()\n    pendown()\n    goto(-98, 66)\n    goto(-88, 97)\n    goto(-65, 71)\n    goto(-54, 16)\n    end_fill()\n    penup()\n    # Tail: draw behind the body.\n    color(\"#294b42\")\n    pensize(24)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color(shade)\n    pensize(16)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color('#e8b454')\n    goto(-143, 14)\n    begin_fill()\n    pendown()\n    goto(-158, -6)\n    goto(-140, -17)\n    goto(-128, -3)\n    goto(-143, 14)\n    end_fill()\n    penup()\n    # Feet, body, and warm belly.\n    goto(-52, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(20, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(-22, -38)\n    dot(126, \"#294b42\")\n    dot(120, shade)\n    goto(-8, -47)\n    dot(73, \"#d6e8af\")\n    # Head and rounded snout.\n    goto(38, 46)\n    dot(90, \"#294b42\")\n    dot(84, shade)\n    goto(76, 27)\n    dot(63, \"#294b42\")\n    dot(57, shade)\n    color('#e8b454')\n    goto(12, 83)\n    begin_fill()\n    pendown()\n    goto(12, 118)\n    goto(32, 87)\n    goto(12, 83)\n    end_fill()\n    penup()\n    color('#e8b454')\n    goto(53, 86)\n    begin_fill()\n    pendown()\n    goto(69, 116)\n    goto(70, 80)\n    goto(53, 86)\n    end_fill()\n    penup()\n    goto(93, 37)\n    dot(5, \"#294b42\")\n    color(\"#294b42\")\n    pensize(3)\n    goto(64, 13)\n    pendown()\n    goto(96, 13)\n    penup()\n    goto(46, 61)\n    dot(19, \"white\")\n    goto(49, 61)\n    dot(10, \"#294b42\")\n    goto(51, 64)\n    dot(3, \"white\")\n\ndragon(\"#58a77a\")", "The winged green dragon looks exactly as it did at the last stop.", "Change only the color in the bottom dragon(...) call.", "shade is now an input to the function. The last line calls the function and supplies that input.", {"related": ["functions", "parameters"], "draftVersion": 2});
  stop(tiny_dragon, "dragon-mood", "Give it a sleepy face", "Keep the recipe. Add a second input, sleepy. An if statement draws a closed eye when sleepy is True; else keeps the open eye.", "if sleepy:", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\ndef dragon(shade, sleepy):\n    color('#7964a3')\n    goto(-50, 0)\n    begin_fill()\n    pendown()\n    goto(-112, 64)\n    goto(-92, 118)\n    goto(-56, 80)\n    goto(-28, 18)\n    goto(-50, 0)\n    end_fill()\n    penup()\n    color('#c0a7cf')\n    goto(-54, 16)\n    begin_fill()\n    pendown()\n    goto(-98, 66)\n    goto(-88, 97)\n    goto(-65, 71)\n    goto(-54, 16)\n    end_fill()\n    penup()\n    # Tail: draw behind the body.\n    color(\"#294b42\")\n    pensize(24)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color(shade)\n    pensize(16)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color('#e8b454')\n    goto(-143, 14)\n    begin_fill()\n    pendown()\n    goto(-158, -6)\n    goto(-140, -17)\n    goto(-128, -3)\n    goto(-143, 14)\n    end_fill()\n    penup()\n    # Feet, body, and warm belly.\n    goto(-52, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(20, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(-22, -38)\n    dot(126, \"#294b42\")\n    dot(120, shade)\n    goto(-8, -47)\n    dot(73, \"#d6e8af\")\n    # Head and rounded snout.\n    goto(38, 46)\n    dot(90, \"#294b42\")\n    dot(84, shade)\n    goto(76, 27)\n    dot(63, \"#294b42\")\n    dot(57, shade)\n    color('#e8b454')\n    goto(12, 83)\n    begin_fill()\n    pendown()\n    goto(12, 118)\n    goto(32, 87)\n    goto(12, 83)\n    end_fill()\n    penup()\n    color('#e8b454')\n    goto(53, 86)\n    begin_fill()\n    pendown()\n    goto(69, 116)\n    goto(70, 80)\n    goto(53, 86)\n    end_fill()\n    penup()\n    goto(93, 37)\n    dot(5, \"#294b42\")\n    color(\"#294b42\")\n    pensize(3)\n    goto(64, 13)\n    pendown()\n    goto(96, 13)\n    penup()\n    if sleepy:\n        goto(38, 60)\n        color(\"#294b42\")\n        pensize(4)\n        pendown()\n        goto(55, 60)\n        penup()\n    else:\n        goto(46, 61)\n        dot(19, \"white\")\n        goto(49, 61)\n        dot(10, \"#294b42\")\n        goto(51, 64)\n        dot(3, \"white\")\n\ndragon(\"#58a77a\", True)", "The same dragon rests with a closed eye.", "Change True to False in the bottom call. Predict the eye before running.", "True and False are Python values, so they have capital first letters and no quotes.", {"related": ["if", "multiple-parameters"], "draftVersion": 2});
  stop(tiny_dragon, "dragon-energy", "Let a number choose the mood", "Keep the two-input recipe. Store energy in a variable. The comparison energy < 3 produces the True or False the recipe already understands.", "energy < 3", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\ndef dragon(shade, sleepy):\n    color('#7964a3')\n    goto(-50, 0)\n    begin_fill()\n    pendown()\n    goto(-112, 64)\n    goto(-92, 118)\n    goto(-56, 80)\n    goto(-28, 18)\n    goto(-50, 0)\n    end_fill()\n    penup()\n    color('#c0a7cf')\n    goto(-54, 16)\n    begin_fill()\n    pendown()\n    goto(-98, 66)\n    goto(-88, 97)\n    goto(-65, 71)\n    goto(-54, 16)\n    end_fill()\n    penup()\n    # Tail: draw behind the body.\n    color(\"#294b42\")\n    pensize(24)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color(shade)\n    pensize(16)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color('#e8b454')\n    goto(-143, 14)\n    begin_fill()\n    pendown()\n    goto(-158, -6)\n    goto(-140, -17)\n    goto(-128, -3)\n    goto(-143, 14)\n    end_fill()\n    penup()\n    # Feet, body, and warm belly.\n    goto(-52, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(20, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(-22, -38)\n    dot(126, \"#294b42\")\n    dot(120, shade)\n    goto(-8, -47)\n    dot(73, \"#d6e8af\")\n    # Head and rounded snout.\n    goto(38, 46)\n    dot(90, \"#294b42\")\n    dot(84, shade)\n    goto(76, 27)\n    dot(63, \"#294b42\")\n    dot(57, shade)\n    color('#e8b454')\n    goto(12, 83)\n    begin_fill()\n    pendown()\n    goto(12, 118)\n    goto(32, 87)\n    goto(12, 83)\n    end_fill()\n    penup()\n    color('#e8b454')\n    goto(53, 86)\n    begin_fill()\n    pendown()\n    goto(69, 116)\n    goto(70, 80)\n    goto(53, 86)\n    end_fill()\n    penup()\n    goto(93, 37)\n    dot(5, \"#294b42\")\n    color(\"#294b42\")\n    pensize(3)\n    goto(64, 13)\n    pendown()\n    goto(96, 13)\n    penup()\n    if sleepy:\n        goto(38, 60)\n        color(\"#294b42\")\n        pensize(4)\n        pendown()\n        goto(55, 60)\n        penup()\n    else:\n        goto(46, 61)\n        dot(19, \"white\")\n        goto(49, 61)\n        dot(10, \"#294b42\")\n        goto(51, 64)\n        dot(3, \"white\")\n\nenergy = 1\ndragon(\"#58a77a\", energy < 3)\n", "At energy 1, the dragon has its eye closed.", "Run with energy 2, then 3. At which value does it wake?", "The comparison happens before the function call. 2 < 3 is True; 3 < 3 is False.", {"related": ["variables", "if"], "draftVersion": 2});
  stop(tiny_dragon, "dragon-feed", "One snack, two energy", "Keep energy and the mood comparison. Add two points before calling the drawing recipe. Trace the three lines at the bottom from top to bottom.", "energy += 2", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\ndef dragon(shade, sleepy):\n    color('#7964a3')\n    goto(-50, 0)\n    begin_fill()\n    pendown()\n    goto(-112, 64)\n    goto(-92, 118)\n    goto(-56, 80)\n    goto(-28, 18)\n    goto(-50, 0)\n    end_fill()\n    penup()\n    color('#c0a7cf')\n    goto(-54, 16)\n    begin_fill()\n    pendown()\n    goto(-98, 66)\n    goto(-88, 97)\n    goto(-65, 71)\n    goto(-54, 16)\n    end_fill()\n    penup()\n    # Tail: draw behind the body.\n    color(\"#294b42\")\n    pensize(24)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color(shade)\n    pensize(16)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color('#e8b454')\n    goto(-143, 14)\n    begin_fill()\n    pendown()\n    goto(-158, -6)\n    goto(-140, -17)\n    goto(-128, -3)\n    goto(-143, 14)\n    end_fill()\n    penup()\n    # Feet, body, and warm belly.\n    goto(-52, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(20, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(-22, -38)\n    dot(126, \"#294b42\")\n    dot(120, shade)\n    goto(-8, -47)\n    dot(73, \"#d6e8af\")\n    # Head and rounded snout.\n    goto(38, 46)\n    dot(90, \"#294b42\")\n    dot(84, shade)\n    goto(76, 27)\n    dot(63, \"#294b42\")\n    dot(57, shade)\n    color('#e8b454')\n    goto(12, 83)\n    begin_fill()\n    pendown()\n    goto(12, 118)\n    goto(32, 87)\n    goto(12, 83)\n    end_fill()\n    penup()\n    color('#e8b454')\n    goto(53, 86)\n    begin_fill()\n    pendown()\n    goto(69, 116)\n    goto(70, 80)\n    goto(53, 86)\n    end_fill()\n    penup()\n    goto(93, 37)\n    dot(5, \"#294b42\")\n    color(\"#294b42\")\n    pensize(3)\n    goto(64, 13)\n    pendown()\n    goto(96, 13)\n    penup()\n    if sleepy:\n        goto(38, 60)\n        color(\"#294b42\")\n        pensize(4)\n        pendown()\n        goto(55, 60)\n        penup()\n    else:\n        goto(46, 61)\n        dot(19, \"white\")\n        goto(49, 61)\n        dot(10, \"#294b42\")\n        goto(51, 64)\n        dot(3, \"white\")\n\nenergy = 1\nenergy += 2\ndragon(\"#58a77a\", energy < 3)\n", "Energy starts at 1, rises to 3, and the dragon wakes.", "Change the snack from 2 to 1. Will the dragon wake?", "energy += 2 means energy = energy + 2. This stop feeds once when the program runs.", {"related": ["augmented-assignment", "variables"], "draftVersion": 2});
  stop(tiny_dragon, "dragon-click", "A snack whenever you click", "Move the two working snack lines into feed(x, y). Register that function with the screen. Run once, then click the drawing to feed again. Let each redraw finish before the next click.", "getscreen().onclick(feed)", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\ndef dragon(shade, sleepy):\n    clear()\n    color('#7964a3')\n    goto(-50, 0)\n    begin_fill()\n    pendown()\n    goto(-112, 64)\n    goto(-92, 118)\n    goto(-56, 80)\n    goto(-28, 18)\n    goto(-50, 0)\n    end_fill()\n    penup()\n    color('#c0a7cf')\n    goto(-54, 16)\n    begin_fill()\n    pendown()\n    goto(-98, 66)\n    goto(-88, 97)\n    goto(-65, 71)\n    goto(-54, 16)\n    end_fill()\n    penup()\n    # Tail: draw behind the body.\n    color(\"#294b42\")\n    pensize(24)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color(shade)\n    pensize(16)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color('#e8b454')\n    goto(-143, 14)\n    begin_fill()\n    pendown()\n    goto(-158, -6)\n    goto(-140, -17)\n    goto(-128, -3)\n    goto(-143, 14)\n    end_fill()\n    penup()\n    # Feet, body, and warm belly.\n    goto(-52, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(20, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(-22, -38)\n    dot(126, \"#294b42\")\n    dot(120, shade)\n    goto(-8, -47)\n    dot(73, \"#d6e8af\")\n    # Head and rounded snout.\n    goto(38, 46)\n    dot(90, \"#294b42\")\n    dot(84, shade)\n    goto(76, 27)\n    dot(63, \"#294b42\")\n    dot(57, shade)\n    color('#e8b454')\n    goto(12, 83)\n    begin_fill()\n    pendown()\n    goto(12, 118)\n    goto(32, 87)\n    goto(12, 83)\n    end_fill()\n    penup()\n    color('#e8b454')\n    goto(53, 86)\n    begin_fill()\n    pendown()\n    goto(69, 116)\n    goto(70, 80)\n    goto(53, 86)\n    end_fill()\n    penup()\n    goto(93, 37)\n    dot(5, \"#294b42\")\n    color(\"#294b42\")\n    pensize(3)\n    goto(64, 13)\n    pendown()\n    goto(96, 13)\n    penup()\n    if sleepy:\n        goto(38, 60)\n        color(\"#294b42\")\n        pensize(4)\n        pendown()\n        goto(55, 60)\n        penup()\n    else:\n        goto(46, 61)\n        dot(19, \"white\")\n        goto(49, 61)\n        dot(10, \"#294b42\")\n        goto(51, 64)\n        dot(3, \"white\")\n\ndef feed(x, y):\n    global energy\n    energy += 2\n    dragon(\"#58a77a\", energy < 3)\n\nenergy = 1\ndragon(\"#58a77a\", energy < 3)\ngetscreen().onclick(feed)\n", "The dragon starts asleep. One click raises energy from 1 to 3 and opens its eye.", "Click once, then press Run again. Why does the dragon start asleep again?", "The screen supplies x and y to the handler. global energy lets it change the stored value. clear() at the start of dragon removes the old face before redrawing.", {"related": ["screen-click", "functions"], "previewCall": "feed(0, 0)\nfeed(0, 0)\nfeed(0, 0)", "previewNote": "After three clicks", "draftVersion": 2});
  stop(tiny_dragon, "dragon-trick", "Three snacks, a first spark", "Keep click feeding. At the end of the dragon recipe, check energy again. At 7 or more, draw three warm sparks beside the mouth.", "if energy >= 7:", "speed(0)\nhideturtle()\npenup()\nbgcolor(\"#fff8ed\")\n\ndef dragon(shade, sleepy):\n    clear()\n    color('#7964a3')\n    goto(-50, 0)\n    begin_fill()\n    pendown()\n    goto(-112, 64)\n    goto(-92, 118)\n    goto(-56, 80)\n    goto(-28, 18)\n    goto(-50, 0)\n    end_fill()\n    penup()\n    color('#c0a7cf')\n    goto(-54, 16)\n    begin_fill()\n    pendown()\n    goto(-98, 66)\n    goto(-88, 97)\n    goto(-65, 71)\n    goto(-54, 16)\n    end_fill()\n    penup()\n    # Tail: draw behind the body.\n    color(\"#294b42\")\n    pensize(24)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color(shade)\n    pensize(16)\n    goto(-55, -52)\n    pendown()\n    goto(-102, -57)\n    goto(-133, -32)\n    goto(-143, -4)\n    penup()\n    color('#e8b454')\n    goto(-143, 14)\n    begin_fill()\n    pendown()\n    goto(-158, -6)\n    goto(-140, -17)\n    goto(-128, -3)\n    goto(-143, 14)\n    end_fill()\n    penup()\n    # Feet, body, and warm belly.\n    goto(-52, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(20, -98)\n    dot(40, \"#294b42\")\n    dot(34, shade)\n    goto(-22, -38)\n    dot(126, \"#294b42\")\n    dot(120, shade)\n    goto(-8, -47)\n    dot(73, \"#d6e8af\")\n    # Head and rounded snout.\n    goto(38, 46)\n    dot(90, \"#294b42\")\n    dot(84, shade)\n    goto(76, 27)\n    dot(63, \"#294b42\")\n    dot(57, shade)\n    color('#e8b454')\n    goto(12, 83)\n    begin_fill()\n    pendown()\n    goto(12, 118)\n    goto(32, 87)\n    goto(12, 83)\n    end_fill()\n    penup()\n    color('#e8b454')\n    goto(53, 86)\n    begin_fill()\n    pendown()\n    goto(69, 116)\n    goto(70, 80)\n    goto(53, 86)\n    end_fill()\n    penup()\n    goto(93, 37)\n    dot(5, \"#294b42\")\n    color(\"#294b42\")\n    pensize(3)\n    goto(64, 13)\n    pendown()\n    goto(96, 13)\n    penup()\n    if sleepy:\n        goto(38, 60)\n        color(\"#294b42\")\n        pensize(4)\n        pendown()\n        goto(55, 60)\n        penup()\n    else:\n        goto(46, 61)\n        dot(19, \"white\")\n        goto(49, 61)\n        dot(10, \"#294b42\")\n        goto(51, 64)\n        dot(3, \"white\")\n    if energy >= 7:\n        goto(126, 24)\n        dot(30, \"#ed854a\")\n        goto(143, 30)\n        dot(18, \"#f6c55e\")\n        goto(160, 38)\n        dot(8, \"#ed854a\")\n\ndef feed(x, y):\n    global energy\n    energy += 2\n    dragon(\"#58a77a\", energy < 3)\n\nenergy = 1\ndragon(\"#58a77a\", energy < 3)\ngetscreen().onclick(feed)\n", "After Run: sleeping. After one click: awake. After three separate clicks, waiting for each redraw: three sparks beside the mouth.", "Change the threshold to 5. Predict how many clicks are needed from energy 1.", "The spark check belongs inside dragon, after drawing the face. Each click redraws from the current energy.", {"related": ["if", "screen-click"], "previewCall": "feed(0, 0)\nfeed(0, 0)\nfeed(0, 0)", "previewNote": "After three clicks", "draftVersion": 2});

  window.TURTLE_TRAILS = trails;
  if (window.TURTLE_REFERENCE) window.TURTLE_REFERENCE.push(...trails.flatMap(path => path.stops));
})();
