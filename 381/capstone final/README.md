Quinn Smiley  
CIT 381  
December 8th, 2025  

My project is a buzzfeed-type quiz that tells you which cartoon character you are (My Melody or Kuromi) based on the answers to three questions (my new and improved version of my 281 project). The client must signup with their name, email, username, password, and optionally a profile picture. 

The user information is stored within the users table which also gives each user a unique user_id (auto-incremented). After signing up the client is able to take the quiz. 

The responses to each question are stored in the responses table which also gives each attempt of the quiz a unique attempt_id (auto-incremented). After the user has filled out the quiz they click the submit button to view their results. 

The results are recorded in the results table which also gives each result a unique result_id (auto-incremented). From there on the client can either share their results, retake the quiz, or view their profile. 