const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://iftmtsmcfvxlvxsqief.supabase.co";
const supabaseKey = "sb_publishable_sm22Lsm0zAnY3O0pEhXFZg_jeGZ2FEN";

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Validate email
    if (!email || !email.includes("@")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email" }),
      };
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ email }]);

    if (error) {
      // Handle duplicate email
      if (error.code === "23505") {
        return {
          statusCode: 409,
          body: JSON.stringify({ error: "Email already registered" }),
        };
      }
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Successfully added to waitlist" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
