document.addEventListener('DOMContentLoaded', async () => {
  const authModal = document.getElementById('auth-modal');
  const quizContainer = document.getElementById('quiz-container');
  const authForm = document.getElementById('auth-form');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authTitle = document.getElementById('auth-title');
  const signinFields = document.getElementById('signin-fields');
  const signupFields = document.getElementById('signup-fields');
  const errorMessage = document.getElementById('auth-error');
  const profilePictureInput = document.getElementById('profile-picture-input');
  const profilePreview = document.getElementById('profile-preview');
  let currentMode = 'signin';

  // Tab switching
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      currentMode = tab.dataset.mode;
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      authTitle.textContent = currentMode === 'signin' ? 'Sign In' : 'Sign Up';
      
      // Show/hide appropriate fields
      if (currentMode === 'signin') {
        signinFields.style.display = 'block';
        signupFields.style.display = 'none';
      } else {
        signinFields.style.display = 'none';
        signupFields.style.display = 'block';
      }
      
      errorMessage.classList.remove('show');
      errorMessage.textContent = '';
      authForm.reset();
      profilePreview.classList.remove('show');
      profilePreview.innerHTML = '';
    });
  });

  // Profile picture preview
  profilePictureInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('Profile picture must be less than 5MB');
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePreview.innerHTML = `<img src="${e.target.result}" alt="Profile preview">`;
        profilePreview.classList.add('show');
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle sign-in/sign-up form submission
  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    
    try {
      if (currentMode === 'signin') {
        // Sign In
        const username = document.getElementById('username-input').value.trim();
        const password = document.getElementById('password-input').value;
        
        if (!username || !password) {
          showError('Please enter both username and password');
          return;
        }

        const response = await fetch('/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Hide modal and show quiz
          authModal.style.display = 'none';
          quizContainer.classList.remove('hidden');
          // Show hamburger menu
          document.querySelector('.top-nav').classList.add('visible');
        } else {
          showError(data.error || 'Invalid username or password');
        }
      } else {
        // Sign Up
        const email = document.getElementById('email-input').value.trim();
        const username = document.getElementById('signup-username-input').value.trim();
        const name = document.getElementById('name-input').value.trim();
        const password = document.getElementById('signup-password-input').value;
        const profilePictureFile = profilePictureInput.files[0];
        
        if (!email || !username || !name || !password) {
          showError('Please fill in all required fields');
          return;
        }

        if (password.length < 6) {
          showError('Password must be at least 6 characters long');
          return;
        }

        // Convert profile picture to base64 if provided
        let profilePictureBase64 = null;
        if (profilePictureFile) {
          profilePictureBase64 = await fileToBase64(profilePictureFile);
        }

        const response = await fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            email, 
            username,
            name,
            password,
            profilePicture: profilePictureBase64
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Hide modal and show quiz
          authModal.style.display = 'none';
          quizContainer.classList.remove('hidden');
          // Show hamburger menu
          document.querySelector('.top-nav').classList.add('visible');
        } else {
          showError(data.error || 'Failed to create account. Please try again.');
        }
      }
    } catch (error) {
      showError('Network error. Please try again.');
      console.error('Error:', error);
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Check if user is already signed in (optional - you can check session)
  // For now, we'll always show the modal on page load

  // Hamburger Menu Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking outside (with a small delay to allow button clicks)
  let closeMenuTimeout;
  document.addEventListener('click', (event) => {
    // Check if clicking on a nav menu item button
    const clickedButton = event.target.closest('button.nav-menu-item');
    if (clickedButton) {
      // Don't close menu immediately if clicking a button - let the button handler run first
      clearTimeout(closeMenuTimeout);
      return;
    }
    
    // Don't close if clicking on hamburger button or nav menu
    const isClickInsideNav = hamburgerBtn.contains(event.target) || 
                             navMenu.contains(event.target);
    
    if (!isClickInsideNav && navMenu.classList.contains('active')) {
      // Small delay to allow button clicks to process first
      clearTimeout(closeMenuTimeout);
      closeMenuTimeout = setTimeout(() => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }, 150);
    } else {
      clearTimeout(closeMenuTimeout);
    }
  });

  // Add visual feedback for selected radio buttons
  const radioInputs = document.querySelectorAll('input[type="radio"]');
  radioInputs.forEach(input => {
    input.addEventListener('change', function() {
      // Remove selected class from all labels in the same group
      const groupName = this.name;
      const allLabelsInGroup = document.querySelectorAll(`label:has(input[name="${groupName}"])`);
      allLabelsInGroup.forEach(label => {
        label.classList.remove('selected-option');
      });
      
      // Add selected class to the parent label of the checked input
      if (this.checked && this.parentElement.tagName === 'LABEL') {
        this.parentElement.classList.add('selected-option');
      }
    });
    
    // Set initial state if already checked
    if (input.checked && input.parentElement.tagName === 'LABEL') {
      input.parentElement.classList.add('selected-option');
    }
  });

  document.getElementById('quiz-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const color = parseInt(document.querySelector('input[name="color"]:checked').value);
    const music = parseInt(document.querySelector('input[name="music"]:checked').value);
    const activity = parseInt(document.querySelector('input[name="activity"]:checked').value);

    const response = await fetch('/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        colorResponse: color,
        musicResponse: music,
        activityResponse: activity
      })
    });

    const data = await response.json();
    console.log(data);

    const resultRes = await fetch('/get-result', {
      credentials: 'include'
    });

    const resultText = await resultRes.text();
    
    // Parse the result to determine character (case-insensitive check)
    const isMyMelody = resultText.toLowerCase().includes('my melody');
    const characterName = isMyMelody ? 'My Melody' : 'Kuromi';
    
    console.log('Result text:', resultText);
    console.log('Character determined:', characterName);
    
    // Show results page
    showResultsPage(characterName, resultText);
  });
  
  // Function to show results page
  function showResultsPage(characterName, message) {
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const characterImage = document.getElementById('character-image');
    const characterNameEl = document.getElementById('character-name');
    const shareLinkInput = document.getElementById('share-link-input');
    const shareMessage = document.getElementById('share-message');
    
    // Clear any previous error handlers
    characterImage.onerror = null;
    
    // Set character image based on result
    // Note: Add character images to the public folder with these exact filenames
    if (characterName === 'My Melody') {
      characterImage.src = 'images/my_melody.jpg';
      characterImage.alt = 'My Melody';
      console.log('Setting image to: images/my_melody.jpg');
    } else if (characterName === 'Kuromi') {
      characterImage.src = 'images/kuromi.jpg';
      characterImage.alt = 'Kuromi';
      console.log('Setting image to: images/kuromi.jpg');
    }
    
    // Fallback to placeholder if image doesn't exist
    characterImage.onerror = function() {
      console.warn('Character image not found, using placeholder');
      if (characterName === 'My Melody') {
        this.src = 'https://via.placeholder.com/250x250/ff0080/ffffff?text=My+Melody';
      } else {
        this.src = 'https://via.placeholder.com/250x250/800080/ffffff?text=Kuromi';
      }
    };
    
    // Set character name
    characterNameEl.textContent = characterName;
    
    // Generate shareable link with result
    const shareUrl = `${window.location.origin}${window.location.pathname}?result=${encodeURIComponent(characterName)}`;
    if (shareLinkInput) {
      shareLinkInput.value = shareUrl;
    }
    
    // Clear any previous share messages
    if (shareMessage) {
      shareMessage.textContent = '';
      shareMessage.className = 'share-message';
    }
    
    // Hide quiz and show results
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Copy link button functionality
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const shareLinkInput = document.getElementById('share-link-input');
  const shareMessage = document.getElementById('share-message');
  
  if (copyLinkBtn && shareLinkInput) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        // Select and copy the link
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999); // For mobile devices
        
        await navigator.clipboard.writeText(shareLinkInput.value);
        
        // Show success message
        if (shareMessage) {
          shareMessage.textContent = 'Link copied to clipboard!';
          shareMessage.classList.add('success');
          shareMessage.classList.remove('error');
          
          // Clear message after 3 seconds
          setTimeout(() => {
            shareMessage.textContent = '';
            shareMessage.className = 'share-message';
          }, 3000);
        }
      } catch (err) {
        // Fallback for browsers that don't support clipboard API
        try {
          document.execCommand('copy');
          if (shareMessage) {
            shareMessage.textContent = 'Link copied to clipboard!';
            shareMessage.classList.add('success');
            shareMessage.classList.remove('error');
            
            setTimeout(() => {
              shareMessage.textContent = '';
              shareMessage.className = 'share-message';
            }, 3000);
          }
        } catch (fallbackErr) {
          if (shareMessage) {
            shareMessage.textContent = 'Failed to copy link. Please select and copy manually.';
            shareMessage.classList.add('error');
            shareMessage.classList.remove('success');
          }
        }
      }
    });
    
    // Allow clicking on input to select all
    shareLinkInput.addEventListener('click', function() {
      this.select();
    });
  }
  
  // Retake Quiz button
  const retakeQuizBtn = document.getElementById('retake-quiz-btn');
  retakeQuizBtn.addEventListener('click', () => {
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    
    // Reset form
    document.getElementById('quiz-form').reset();
    
    // Remove selected-option classes
    document.querySelectorAll('.selected-option').forEach(el => {
      el.classList.remove('selected-option');
    });
    
    // Hide results and show quiz
    resultsContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // View Profile from Results button
  const viewProfileFromResultsBtn = document.getElementById('view-profile-from-results-btn');
  viewProfileFromResultsBtn.addEventListener('click', () => {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.add('hidden');
    
    // Use existing loadProfile function
    if (typeof loadProfile === 'function') {
      loadProfile();
    } else {
      // Fallback: navigate to profile
      const profileContainer = document.getElementById('profile-container');
      const quizContainer = document.getElementById('quiz-container');
      quizContainer.classList.add('hidden');
      profileContainer.classList.remove('hidden');
    }
  });

  // Rename functionality has been moved to the profile page

  // View Profile functionality
  const viewProfileButton = document.getElementById('view-profile-button');
  const profileContainer = document.getElementById('profile-container');
  const backToQuizButton = document.getElementById('back-to-quiz-btn');
  const navHomeButton = document.getElementById('nav-home-button');
  const navViewProfileButton = document.getElementById('nav-view-profile-button');
  
  // Home button - navigate back to quiz
  if (navHomeButton) {
    navHomeButton.addEventListener('click', () => {
      // Close menu first
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
      
      // Hide results and profile pages, show quiz
      const resultsContainer = document.getElementById('results-container');
      // Use profileContainer and quizContainer from outer scope
      
      if (resultsContainer) resultsContainer.classList.add('hidden');
      if (profileContainer) profileContainer.classList.add('hidden');
      if (quizContainer) quizContainer.classList.remove('hidden');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Debug: Check if button exists
  console.log('navViewProfileButton found:', navViewProfileButton);

  // Function to load and display profile
  const loadProfile = async () => {
    try {
      // Fetch profile data
      const response = await fetch('/profile', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const profileData = await response.json();
        
        // Display profile data
        document.getElementById('profile-name').textContent = profileData.name || 'N/A';
        document.getElementById('profile-username').textContent = profileData.username || 'N/A';
        document.getElementById('profile-email').textContent = profileData.email || 'N/A';
        
        // Format and display creation date
        if (profileData.createdAt) {
          const date = new Date(profileData.createdAt);
          document.getElementById('profile-created').textContent = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } else {
          document.getElementById('profile-created').textContent = 'N/A';
        }
        
        // Display profile picture
        const profilePictureContainer = document.querySelector('.profile-picture-container');
        const profilePictureDisplay = document.getElementById('profile-picture-display');
        let placeholder = profilePictureContainer.querySelector('.profile-picture-placeholder');
        
        if (profileData.profilePicture) {
          profilePictureDisplay.src = profileData.profilePicture;
          profilePictureDisplay.style.display = 'block';
          // Remove placeholder if it exists
          if (placeholder) {
            placeholder.remove();
          }
        } else {
          profilePictureDisplay.style.display = 'none';
          // Add placeholder if it doesn't exist
          if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.className = 'profile-picture-placeholder';
            placeholder.textContent = 'No Picture';
            profilePictureContainer.appendChild(placeholder);
          }
        }
        
        // Show profile page and hide quiz
        // Use the quizContainer and profileContainer defined in outer scope
        if (quizContainer) quizContainer.classList.add('hidden');
        if (profileContainer) profileContainer.classList.remove('hidden');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile. Please try again.');
    }
  };

  // Connect both view profile buttons
  if (viewProfileButton) {
    viewProfileButton.addEventListener('click', loadProfile);
  }
  
  // Connect nav view profile button to use loadProfile function
  if (navViewProfileButton) {
    console.log('Attaching event listener to nav-view-profile-button');
    navViewProfileButton.addEventListener('click', function(e) {
      console.log('View Profile button clicked!'); // Debug log
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling up
      
      // Clear any pending close menu timeout
      if (typeof closeMenuTimeout !== 'undefined') {
        clearTimeout(closeMenuTimeout);
      }
      
      // Close menu immediately
      if (hamburgerBtn) hamburgerBtn.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
      
      // Load profile
      console.log('Calling loadProfile function...');
      loadProfile().catch(err => {
        console.error('Error in loadProfile:', err);
        alert('Failed to load profile: ' + err.message);
      });
    }, true); // Use capture phase to run before document click handler
  } else {
    console.error('nav-view-profile-button not found in DOM');
  }

  // Back to Quiz button
  backToQuizButton.addEventListener('click', () => {
    profileContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
  });

  // Profile Rename functionality
  const profileRenameButton = document.getElementById('profile-rename-button');
  const profileRenameInput = document.getElementById('profile-rename-input');
  const profileRenameMessage = document.getElementById('profile-rename-message');

  profileRenameButton.addEventListener('click', async () => {
    const newName = profileRenameInput.value.trim();
    profileRenameMessage.textContent = '';
    profileRenameMessage.className = 'profile-rename-message';

    if (!newName) {
      profileRenameMessage.textContent = 'Please enter a name.';
      profileRenameMessage.classList.add('error');
      return;
    }

    // Disable button during request
    profileRenameButton.disabled = true;
    profileRenameButton.textContent = 'Updating...';

    try {
      const response = await fetch('/rename', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newName })
      });

      const data = await response.json();
      
      if (response.ok) {
        profileRenameMessage.textContent = `Name successfully changed to ${data.name}!`;
        profileRenameMessage.classList.add('success');
        profileRenameInput.value = '';
        
        // Update the displayed name on the profile page
        document.getElementById('profile-name').textContent = data.name;
        
        // Update session name for quiz results
        // The server already updated the session, so we just need to refresh the display
      } else {
        profileRenameMessage.textContent = data.error || 'Failed to rename';
        profileRenameMessage.classList.add('error');
      }
    } catch (error) {
      console.error('Error renaming:', error);
      profileRenameMessage.textContent = 'Network error. Please try again.';
      profileRenameMessage.classList.add('error');
    } finally {
      profileRenameButton.disabled = false;
      profileRenameButton.textContent = 'Update Name';
    }
  });

  // Allow Enter key to submit rename
  profileRenameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      profileRenameButton.click();
    }
  });
});

