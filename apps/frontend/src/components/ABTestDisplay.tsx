"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  GenerateContentResponse,
  SelectedOption,
  SelectOptionRequest,
} from "@/types";
import { apiClient } from "@/lib/api-client";
import { Check, Hash, MessageSquare, ArrowLeft } from "lucide-react";

interface ABTestDisplayProps {
  generation: GenerateContentResponse;
  onSelectionComplete: () => void;
}

export function ABTestDisplay({
  generation,
  onSelectionComplete,
}: ABTestDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  const handleOptionSelect = async (option: SelectedOption) => {
    setSelectedOption(option);
    setSubmitting(true);

    try {
      const requestData: SelectOptionRequest = {
        generationId: generation.id,
        selectedOption: option,
      };

      await apiClient.post("/api/select", requestData);
      toast.success(`Option ${option} selected!`);
      onSelectionComplete();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save selection");
      setSelectedOption(null);
    } finally {
      setSubmitting(false);
    }
  };

  const OptionCard = ({
    option,
    content,
    label,
  }: {
    option: SelectedOption;
    content: { caption: string; hashtags: string[] };
    label: string;
  }) => (
    <div
      className={`card cursor-pointer transition-all duration-200 ${
        selectedOption === option
          ? "ring-2 ring-primary-500 bg-primary-50"
          : "hover:shadow-md hover:scale-[1.02]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Option {label}</h3>
        {selectedOption === option && (
          <div className="flex items-center gap-2 text-primary-600">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Selected</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Caption</span>
          </div>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
            {content.caption}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Hashtags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((hashtag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                #{hashtag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!selectedOption && (
        <button
          onClick={() => handleOptionSelect(option)}
          disabled={submitting}
          className="w-full mt-6 btn-primary disabled:opacity-50"
        >
          Select Option {label}
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <button
        onClick={onSelectionComplete}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Generate
      </button>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Choose Your Content
        </h2>
        <p className="text-gray-600 mt-1">
          Prompt: <span className="font-medium">{generation.prompt}</span> •
          Type: <span className="font-medium">{generation.type}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <OptionCard option={SelectedOption.A} content={generation.optionA} label="A" />
        <OptionCard option={SelectedOption.B} content={generation.optionB} label="B" />
      </div>

      {selectedOption && (
        <div className="text-center">
          <p className="text-green-600 font-medium">
            ✨ Great choice! Your selection helps improve our AI
            recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
