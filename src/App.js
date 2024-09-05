import React, { useState, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

function App() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "AIzaSyBPVhFUhfpgmtxdA-bujh3wsHvH7CtSTNQ";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  const getFact = async () => {
    setLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: "nenne mir einen interessanten fakt, den nicht viele kennen." }],
          },
        ],
      });
      const result = await chatSession.sendMessage("gib mir einen weiteren interessanten fakt.");
      setFact(result.response.text());
    } catch (error) {
      console.error("fehler beim abrufen des fakts:", error);
      setFact("es gab ein problem beim abrufen eines fakts.");
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);
  
  const particlesOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    particles: {
      color: {
        value: "#ffffff",
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 0.3,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 100,
      },
      opacity: {
        value: 0.5,
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.1,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
      blur: {
        enable: true,
        value: 1,
      },
      twinkle: {
        enable: true,
        frequency: 0.05,
        opacity: 1,
      },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden font-notion">
      <Particles className="absolute inset-0 -z-10" init={particlesInit} options={particlesOptions} />
      <div className="max-w-md w-full bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl mb-6 text-center">interessanter fakt generator</h1>
        <button
          onClick={getFact}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "lädt..." : "lerne etwas neues"}
        </button>
        <p className="mt-6 text-lg leading-relaxed">{fact}</p>
      </div>
    </div>
  );
}

export default App;