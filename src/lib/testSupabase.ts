import { supabase } from '../integrations/supabase/client';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('providers')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection successful!');
    return { success: true, data };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { success: false, error: 'Connection test failed' };
  }
}

export async function insertTestProvider() {
  try {
    const testProvider = {
      npi_number: '1234567890',
      first_name: 'Test',
      last_name: 'Provider',
      organization_name: 'Test Organization',
      provider_type: 'Individual',
      specialty: 'Internal Medicine',
      status: 'active'
    };
    
    const { data, error } = await supabase
      .from('providers')
      .insert(testProvider)
      .select();
    
    if (error) {
      console.error('Insert error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Test provider inserted successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Insert test failed:', err);
    return { success: false, error: 'Insert test failed' };
  }
}
