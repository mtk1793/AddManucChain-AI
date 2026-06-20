import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  role: string;
  organization: string;
  sectors: string[];
  challenge: string;
  wantsCall: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();
    
    // Validate required fields
    if (!data.name || !data.role || !data.organization) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a production environment, you would:
    // 1. Store the submission in a database
    // 2. Send an email notification
    // 3. Possibly integrate with a CRM
    
    // For now, we'll just log the submission and return success
    console.log("Contact form submission:", {
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true, 
      message: "Application received successfully" 
    });
    
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
