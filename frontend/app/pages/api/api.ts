export const createOrEditGuild = async (data: {
    guildId: string;
    customTitle: string;
    customIcon: string;
    description: string;
    detailedDescription: string;
    selectedRoles: string[];
    ownerWallet: string;
  }) => {
    try {
      // Define the API endpoint URL
      const url = data.guildId ? `/api/guilds/${data.guildId}` : '/api/guilds';
  
      // Send the request to the server
      const response = await fetch(url, {
        method: data.guildId ? 'PUT' : 'POST', // Use PUT for edit, POST for new guild
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.customTitle,
          icon: data.customIcon,
          description: data.description,
          details: data.detailedDescription,
          roles: data.selectedRoles,
          ownerWallet: data.ownerWallet,
        }),
      });
  
      // Check for a successful response
      if (!response.ok) {
        throw new Error(`Failed to ${data.guildId ? 'edit' : 'create'} guild.`);
      }
  
      // Parse the response as JSON
      const responseData = await response.json();
  
      // Return the response data (could be the guild details or a success message)
      return responseData;
    } catch (error) {
      console.error('Error in createOrEditGuild:', error);
      throw error;
    }
  };
  