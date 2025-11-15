/*
// app/api/getBestTrainer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Trainer } from "@/types/Trainer";

// Example trainers data

const trainers: Trainer[] = [
  {
    id: "trainer-001",
    name: "Lina Moretti",
    avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Strength & Conditioning Coach",
    rating: 4.8,
    experience_years: 6,
    bio: "Certified trainer specialized in building functional strength and sustainable habits.",
    specialties: ["Strength Training", "Functional Fitness", "Mobility"],
    certifications: ["NASM CPT", "CrossFit Level 1"],
    available_hours: ["Mon-Fri 8:00-16:00", "Sat 9:00-13:00"],
    clients: [],
  },
  {
    id: "trainer-002",
    name: "Marcus Tan",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "HIIT & Cardio Expert",
    rating: 4.9,
    experience_years: 8,
    bio: "Former professional sprinter helping clients improve endurance, explosiveness, and overall athleticism.",
    specialties: ["HIIT", "Cardio", "Explosive Training"],
    certifications: ["ACE Personal Trainer", "Precision Nutrition Level 1"],
    available_hours: ["Tue-Sun 10:00-18:00"],
    clients: [],
  },
  {
    id: "trainer-003",
    name: "Sofia Delgado",
    avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "Yoga & Mindfulness Instructor",
    rating: 4.7,
    experience_years: 5,
    bio: "Yoga teacher blending physical practice with mindful meditation to improve balance, strength, and mental clarity.",
    specialties: ["Yoga", "Mindfulness"],
    certifications: ["RYT 500", "Meditation Coach Certification"],
    available_hours: ["Mon-Fri 7:00-15:00"],
    clients: [],
  },
];
// Use environment variable in production
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { userPrompt } = await req.json();

    if (!userPrompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Prepare trainer info for AI prompt
    const trainerOverview = trainers
      .map(
        (t, i) =>
          `[${i + 1}] ID: ${t.id}\nName: ${t.name}\nRole: ${
            t.role
          }\nSpecialties: ${(
            t.specialties || ["Weight lifting", "Yoga", "HIIT"]
          ).join(", ")}\nBio: ${t.bio}`
      )
      .join("\n\n");

    const systemPrompt = `
You are a trainer recommendation assistant. Select the SINGLE BEST matching trainer from the list below based on the user's request.

STRICT RULES:
1. Choose EXACTLY ONE trainer.
2. Return ONLY a raw JSON object with the trainer's exact ID.
3. Format: {"id": "the-exact-trainer-id"}

Trainers list:
${trainerOverview}
    `.trim();

    // Fetch from OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenAI API error ${response.status}: ${errorText}` },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      return NextResponse.json(
        { error: "OpenAI returned empty response" },
        { status: 500 }
      );
    }

    let content = data.choices[0].message.content.trim();

    // Remove wrapping quotes if AI returned stringified JSON
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1).replace(/\\"/g, '"');
    }

    // Extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "No valid JSON found in OpenAI response" },
        { status: 500 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse JSON from OpenAI response" },
        { status: 500 }
      );
    }

    if (!parsed || typeof parsed !== "object" || !("id" in parsed)) {
      return NextResponse.json(
        { error: "Response missing 'id' field" },
        { status: 500 }
      );
    }

    const trainer = trainers.find((t) => t.id === String(parsed.id));
    if (!trainer) {
      return NextResponse.json(
        { error: `Trainer ID "${parsed.id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ trainer });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

*/
