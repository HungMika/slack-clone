"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, LogOut, Edit } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../api/use-current-user";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { toast } from "sonner";
import { useUpdateUser } from "@/features/users/api/use-update-user";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { mutate: updateUser } = useUpdateUser();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }
  if (!data) return null;

  const { name: userName, image: userImage } = data;
  const avatarFallback = userName!.charAt(0).toUpperCase();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsUpdating(true);

      let imageUrl = null;
      if (image) {
        const uploadUrl = await generateUploadUrl({}, { throwError: true });
        if (!uploadUrl) throw new Error("Failed to generate upload URL");

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!response.ok) throw new Error("Failed to upload image");

        const { storageId } = await response.json();
        imageUrl = storageId;
      }

      await updateUser(
        { name: name || userName, image: imageUrl || userImage },
        {
          onSuccess: () => {
            toast.success("Profile updated successfully!");
            setEditOpen(false);
          },
          onError: () => {
            toast.error("Failed to update profile.");
          },
        }
      );
    } catch (err) {
      toast.error("An error occurred while updating profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="size-10 hover:opacity-75 transition rounded-md">
            <AvatarImage
              className="rounded-md"
              alt={userName}
              src={userImage}
            />
            <AvatarFallback className="rounded-md bg-sky-500 text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="right" className="w-60">
          <DropdownMenuItem
            onClick={() => {
              setName(userName || "");
              setPreviewImage(userImage || null);
              setEditOpen(true);
            }}
            className="h-10"
          >
            <Edit className="size-4 mr-2" /> Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              signOut();
            }}
            className="h-10"
          >
            <LogOut className="size-4 mr-2" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {editOpen && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  disabled={isUpdating}
                  required
                  minLength={3}
                  maxLength={80}
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUpdating}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {previewImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Preview:</p>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-24 h-24 rounded-full"
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
