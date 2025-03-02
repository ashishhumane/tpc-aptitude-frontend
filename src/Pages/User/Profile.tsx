"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Profile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "John Doe",
      email: "johndoe@example.com",
      bio: "Web Developer & Designer",
    },
  });

  const onSubmit = (data: any) => {
    toast.success("Profile updated successfully!");
    console.log(data);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileImage || "/default-avatar.png"} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-pic"
                
              />
              <Label htmlFor="profile-pic">
                <Button type="button" variant="outline" className="cursor-not-allowed">
                  Change Picture
                </Button>
              </Label>
            </div>

            {/* Name Field */}
            <div>
              <Label>Name</Label>
              <Input {...register("name")} disabled />
            </div>

            {/* Email Field */}
            <div>
              <Label>Email</Label>
              <Input {...register("email")} disabled />
            </div>

            {/* Bio Field */}
            <div>
              <Label>Bio</Label>
              <Input {...register("bio")} disabled />
            </div>

            {/* Save Button */}
            <Button type="submit" disabled>Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Password changed successfully!");
              reset();
            }}
            className="space-y-4"
          >
            <div>
              <Label>Current Password</Label>
              <Input type="password" disabled />
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" disabled />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input type="password" disabled />
            </div>
            <Button type="submit" disabled>Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
