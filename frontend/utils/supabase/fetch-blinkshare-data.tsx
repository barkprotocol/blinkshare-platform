import { supabase } from '@/lib/supabase-client';

/**
 * Fetches data from the Blinkshare table in Supabase.
 *
 * @param {string} tableName - The name of the table to query.
 * @returns {Promise<any>} - A promise that resolves to the data or an error message.
 */
export const fetchBlinkshareData = async (tableName: string): Promise<any> => {
  try {
    const { data, error } = await supabase.from(tableName).select('*');

    if (error) {
      console.error(`Error fetching data from ${tableName}:`, error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching BlinkShare data:', error);
    throw new Error('Failed to fetch BlinkShare data');
  }
};

/**
 * Fetches Discord-related data for BlinkShare from Supabase.
 *
 * @param {string} tableName - The name of the table containing Discord data.
 * @returns {Promise<any>} - A promise that resolves to the Discord data or an error message.
 */
export const fetchBlinkShareDiscordData = async (tableName: string): Promise<any> => {
  try {
    const { data, error } = await supabase.from(tableName).select('*');

    if (error) {
      console.error(`Error fetching Discord data from ${tableName}:`, error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching BlinkShare Discord data:', error);
    throw new Error('Failed to fetch BlinkShare Discord data');
  }
};

/**
 * Fetches BlinkShare Discord Bot details from Supabase.
 *
 * @param {string} tableName - The name of the table containing Discord bot details.
 * @returns {Promise<any>} - A promise that resolves to the bot data or an error message.
 */
export const fetchBlinkShareDiscordBotData = async (tableName: string): Promise<any> => {
  try {
    const { data, error } = await supabase.from(tableName).select('*');

    if (error) {
      console.error(`Error fetching Discord bot data from ${tableName}:`, error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching BlinkShare Discord Bot data:', error);
    throw new Error('Failed to fetch BlinkShare Discord Bot data');
  }
};
