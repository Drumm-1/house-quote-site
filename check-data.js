const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkData() {
  console.log('📊 Checking for new data in database...\n')

  try {
    // Check properties
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (propError) throw propError

    console.log(`🏠 Properties: ${properties.length} found`)
    properties.forEach((prop, i) => {
      console.log(`   ${i+1}. ${prop.address} - ${prop.bedrooms}bed/${prop.bathrooms}bath`)
      console.log(`      Created: ${new Date(prop.created_at).toLocaleString()}`)
    })

    // Check quotes
    const { data: quotes, error: quoteError } = await supabase
      .from('quotes')
      .select(`
        *,
        properties (address, city, state)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (quoteError) throw quoteError

    console.log(`\n💰 Quotes: ${quotes.length} found`)
    quotes.forEach((quote, i) => {
      console.log(`   ${i+1}. $${quote.amount.toLocaleString()} - ${quote.properties?.address || 'Unknown Address'}`)
      console.log(`      Status: ${quote.status} | Timeline: ${quote.timeline}`)
      console.log(`      Created: ${new Date(quote.created_at).toLocaleString()}`)
    })

    // Check user profiles
    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (userError) throw userError

    console.log(`\n👤 User Profiles: ${users.length} found`)
    users.forEach((user, i) => {
      console.log(`   ${i+1}. ${user.first_name || 'N/A'} ${user.last_name || 'N/A'} - ${user.user_type || 'seller'}`)
      console.log(`      Created: ${new Date(user.created_at).toLocaleString()}`)
    })

    if (properties.length === 0 && quotes.length === 0 && users.length === 0) {
      console.log('\n🔍 No data found yet. Try:')
      console.log('   1. Go to http://localhost:3000/get-quote')
      console.log('   2. Create an account and verify email')
      console.log('   3. Submit a property quote')
      console.log('   4. Run this script again')
    } else {
      console.log('\n✅ Data is being written to your database!')
    }

  } catch (error) {
    console.error('❌ Error checking data:', error.message)
  }
}

checkData() 