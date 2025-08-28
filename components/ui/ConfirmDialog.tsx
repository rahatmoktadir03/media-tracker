"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "🗑️",
          confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
          iconClass: "text-red-600",
        };
      case "warning":
        return {
          icon: "⚠️",
          confirmButtonClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
          iconClass: "text-yellow-600",
        };
      default:
        return {
          icon: "ℹ️",
          confirmButtonClass: "bg-blue-600 hover:bg-blue-700 text-white",
          iconClass: "text-blue-600",
        };
    }
  };

  const { icon, confirmButtonClass, iconClass } = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <span className={`text-2xl mr-3 ${iconClass}`}>{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose} className="px-4 py-2">
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`px-4 py-2 ${confirmButtonClass}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
