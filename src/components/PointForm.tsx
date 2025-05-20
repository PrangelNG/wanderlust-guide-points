
import React, { useState } from 'react';
import { MapPoint } from '@/lib/types';
import { generateMapPointId } from '@/lib/mapUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { MapPin } from 'lucide-react';

interface PointFormProps {
  coordinates: { lat: number; lng: number } | null;
  onSave: (point: MapPoint) => void;
  onCancel: () => void;
}

const PointForm: React.FC<PointFormProps> = ({ coordinates, onSave, onCancel }) => {
  const [formState, setFormState] = useState<{
    name: string;
    description: string;
    address: string;
    instructions: string;
  }>({
    name: '',
    description: '',
    address: '',
    instructions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coordinates) {
      toast({
        title: "Error",
        description: "No coordinates selected.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formState.name || !formState.address) {
      toast({
        title: "Incomplete Form",
        description: "Name and address are required.",
        variant: "destructive"
      });
      return;
    }
    
    const newPoint: MapPoint = {
      id: generateMapPointId(),
      name: formState.name,
      description: formState.description,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      address: formState.address,
      instructions: formState.instructions || undefined,
    };
    
    onSave(newPoint);
    toast({
      title: "Point Added",
      description: `${formState.name} has been added to the map.`,
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Add New Map Point</CardTitle>
            <CardDescription>
              {coordinates
                ? `At coordinates: ${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`
                : 'Select a location on the map first'
              }
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>×</Button>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Point name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Street address or location"
              value={formState.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe this location"
              value={formState.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Access Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder="How to access or find this location"
              value={formState.instructions}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={!coordinates}>
            <MapPin className="h-4 w-4 mr-2" />
            Add Point
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PointForm;
