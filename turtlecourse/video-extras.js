/* Per-video learning extras for the Turtle Course.
   TRANSCRIPTS: [seconds, "text"] lines, cleaned from the video's captions.
   CHECKPOINTS: the video pauses at `at` seconds and asks one question.
     `answer` is the index of the correct choice; `hints` give feedback for
     each wrong choice (never the answer itself). */
window.TurtleCourseVideoExtras={
  transcripts:{
    "1.1.1":[
      [0,"Welcome everyone to Python! We're going to be learning Python with our turtle avatar. To get started, our very first command is"],
      [8,"the forward command. To get Tracy, our turtle avatar, to move forward when we click the Run button, we need to say the name of the command that"],
      [16,"she recognizes, followed by a set of parentheses. We create those parentheses by holding Shift and pressing the 9 key. You'll notice both of them"],
      [25,"appeared, but if they didn't, hold Shift and press 0 to close the parentheses. Then we need to put a number inside those"],
      [33,"parentheses, because she doesn't know how far forward to go until we put a number inside. That number is called the parameter, so we're going to put"],
      [40,"forward(50). Then we can click the green Run button, and Tracy will execute that command, moving forward 50 pixels. You'll"],
      [48,"notice every single time I click Run, she resets back to her starting position in the middle of the world, which is (0,"],
      [55,"0): zero for the x value and zero for the y value. Our first command, forward, lets Tracy move. Now we're going to"],
      [63,"learn the second command, which is circle. We can create a circle by typing the word circle followed by a set"],
      [71,"of parentheses, and again we need to put a number inside those parentheses. Let's say circle(50), and now we have a circle"],
      [79,"with radius 50. Just for context, 50 means the distance between the middle and the outside of the circle. You can see this diagram that shows Tracy"],
      [88,"drawing lines like that, 50 long. Now let's put those two commands together and create this Slinky. The first thing we want to do is"],
      [96,"write circle with 35 in the parentheses. Every single time you write a line of code, I recommend clicking Run to make sure that"],
      [105,"it's doing what you think and there are no errors. After circle, we're going to hit Enter to drop down to the next line."],
      [113,"We could also use the arrow keys to go up lines, and the right or left arrow to move left and right. That's typically much easier than using the"],
      [122,"mouse. Then we type the next command: forward(20). I'm going to run that, and we'll see"],
      [129,"Tracy draws a circle with a radius of 35 and then moves 20 pixels forward. There are five of them in total, so we're"],
      [137,"going to repeat ourselves by writing this a couple more times: circle(35), forward(20). Now I'm going"],
      [145,"to run it again, like I said, to make sure it's doing what I expect. circle(35)... we're going to make a mistake this time..."],
      [152,"forward 20. If we ever make a mistake, we'll get this red error which says \"bad input.\""],
      [160,"It tells us the error is on line number six, and in this case it is on line six. You might notice"],
      [167,"that in this other example the error should be on line seven, but instead it says line eleven. If there's a missing"],
      [174,"parenthesis in your code, the program keeps looking at the following lines, trying to find where the parenthesis might close. It doesn't"],
      [182,"immediately know there's an issue, and if it reaches the end of the code without finding the closing parenthesis, it throws a parsing error. So you"],
      [190,"might get an error message that's later than the actual problem. Always check the lines before the error message too. Here the"],
      [200,"error is on line six. We forgot to put in the parentheses, so in this case"],
      [208,"we have to type the opening parenthesis and then the closing parenthesis: Shift+9 and Shift+0. If we just hit"],
      [215,"Shift+9, they both get added, but if for some reason we need to add them by hand, we have to type"],
      [222,"the opening and then the closing one. A lot of times people forget the closing parenthesis, so always be sure"],
      [229,"you have both the opening and the closing parentheses. You'll also notice it doesn't matter if there's an extra blank line between commands, but"],
      [237,"we usually keep them together, just like that. Great, we have three circles. We need two more: circle"],
      [245,"(35). Notice that after I type this, I use the arrow key to move to the end of the line and then hit Enter to drop"],
      [253,"down a line, then forward(20). Run it one more time to make sure it looks good: one circle, then"],
      [263,"two circles, three, four. We need one more, so I'm going to click at the end of line eight and hit Enter, or I"],
      [272,"can use the arrow key. Notice there are currently nine lines of code. If I hit Backspace, there are only eight, so I can't"],
      [280,"click lower than line eight. I have to go to the end of the last line and press Enter to drop down."],
      [288,"Sometimes you'll be in the middle of a line, hit Enter, and part of the line drops down. That's very frustrating! If we ever make a"],
      [297,"mistake on the keyboard, we can hold Ctrl and press Z, the shortcut for undo. That undoes the action we"],
      [306,"just took. So we go to the end of the line, hit Enter, and finish by writing circle(35). See how my"],
      [315,"cursor is not at the end of the line? If I hit Enter, I'd drop that parenthesis down. Ctrl+Z to undo that,"],
      [322,"move my cursor one to the right, and then hit Enter. If you look at Tracy's ending spot, she's actually"],
      [331,"a little further than the end of this circle. Let's go forward one more time so her ending spot"],
      [340,"matches. Our goal is usually to make sure our code matches the result world. Finish this video and click Continue."],
      [348,"Next, you'll run the program you just watched me write. Your"],
      [356,"goal should be to delete the program and try to rebuild it from scratch."],
      [363,"If you get stuck, you can always reset to the starter code."],
      [378,"If you can recreate it after deleting it, without looking, you"],
      [394,"definitely understand it and you're ready to move on and answer the questions. When you're done, save and move on"],
      [403,"to the next activity."]
    ]
  },
  checkpoints:{
    "1.1.1":[
      {at:44,q:"Tracy starts at (0, 0) facing right. What will forward(50) do?",
       choices:["Move Tracy 50 pixels to the right","Move Tracy 50 pixels up","Draw a circle with radius 50","Nothing. She needs more instructions"],answer:0,
       hints:["","Which way is Tracy facing when she starts?","That would need a different command. forward() only moves.","The number 50 is all she needs to know how far to go."]},
      {at:76,q:"Tracy is facing right (east). When she runs circle(50), where on the circle does she start drawing?",
       choices:["At the top of the circle","At the bottom of the circle","In the middle of the circle","On the left side of the circle"],answer:1,
       hints:["Tracy is facing right. To curve around, does she start above the circle or below it?","","Tracy draws the outline, so she's always standing on the edge, never in the middle.","Her first step goes to the right. Picture which part of a circle moves to the right first."]},
      {at:151,q:"Line 6 says  forward 20  with no parentheses. What will happen when we click Run?",
       choices:["Tracy moves forward 20 like normal","Tracy moves forward 0","Python shows an error","Tracy draws a circle"],answer:2,
       hints:["Python is very picky. It needs the command written exactly right.","Python won't guess what you meant.","","There's no circle command on that line."]},
      {at:300,q:"You pressed Enter in the wrong spot and part of a line dropped down. What's the fastest fix?",
       choices:["Delete the whole program and start over","Press Ctrl+Z to undo","Click Run to fix it","Refresh the page"],answer:1,
       hints:["That works, but it's a lot of extra typing! Is there a shortcut?","","Run only runs your code. It doesn't change it.","Refreshing doesn't undo your last keystroke."]}
    ]
  }
};
