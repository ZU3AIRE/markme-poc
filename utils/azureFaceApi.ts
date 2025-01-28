const AZURE_FACE_KEY = process.env.NEXT_PUBLIC_AZURE_FACE_KEY || 'AexzVqm6xsyjGHbzBG0gh0RA7gjY9a1xrUgWoVhkRpKcHFwmP5RMJQQJ99BAACYeBjFXJ3w3AAAKACOGXF';
const AZURE_FACE_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_FACE_ENDPOINT || 'https://markmefacea.cognitiveservices.azure.com/';

const PERSON_GROUP_ID = 'myfacegroup';
const API_ENDPOINT = AZURE_FACE_ENDPOINT;
const API_KEY = AZURE_FACE_KEY;

export async function detectFaces(imageData: string): Promise<any[]> {
  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');
  
  try {
    const response = await fetch(`${AZURE_FACE_ENDPOINT}/face/v1.0/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': AZURE_FACE_KEY,
      },
      body: Buffer.from(base64Data, 'base64'),
    });

    if (!response.ok) {
      throw new Error('Face API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Face API:', error);
    return [];
  }
}

async function createPersonGroup() {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/face/v1.0/persongroups/${PERSON_GROUP_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': API_KEY,
        },
        body: JSON.stringify({
          name: 'My Face Group',
          userData: 'Group containing my face data'
        })
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error creating person group:', error);
    return false;
  }
}

async function createPerson() {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/face/v1.0/persongroups/${PERSON_GROUP_ID}/persons`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': API_KEY,
        },
        body: JSON.stringify({
          name: 'Me',
          userData: 'My face data'
        })
      }
    );
    const data = await response.json();
    return data.personId;
  } catch (error) {
    console.error('Error creating person:', error);
    return null;
  }
}

async function addFaceToPerson(personId: string) {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/face/v1.0/persongroups/${PERSON_GROUP_ID}/persons/${personId}/persistedFaces`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': API_KEY,
        },
        body: JSON.stringify({
          url: 'https://github.com/ZU3AIRE.png'
        })
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error adding face:', error);
    return false;
  }
}

// Main function to setup face
async function setupMyFace() {
    const groupCreated = await createPersonGroup();
    if (!groupCreated) return false;
    
    const personId = await createPerson();
    if (!personId) return false;
    console.log(personId)
    
  const faceAdded = await addFaceToPerson(personId);
  if (!faceAdded) return false;
  
  return true;
}

// Export functions
export {
  setupMyFace,
  createPersonGroup,
  createPerson,
  addFaceToPerson
};
