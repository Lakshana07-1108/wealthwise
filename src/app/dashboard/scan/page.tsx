
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { extractReceiptDetails, ExtractReceiptDetailsOutput } from "@/ai/flows/extract-receipt-details";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Transaction } from "@/lib/types";


export default function ScanReceiptPage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scannedData, setScannedData] = React.useState<ExtractReceiptDetailsOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();


  React.useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setError(null);
    setScannedData(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if(!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUri = canvas.toDataURL("image/jpeg");

    try {
      const result = await extractReceiptDetails({ imageDataUri });
      setScannedData(result);
    } catch (e) {
      console.error(e);
      setError("Failed to scan receipt. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleSaveTransaction = async () => {
    if (!scannedData || !user) return;
    
    const newTransaction: Omit<Transaction, 'id'> = {
        name: scannedData.name,
        amount: scannedData.amount,
        date: new Date(scannedData.date).toISOString(),
        category: scannedData.category,
        type: 'expense'
    }
    
    try {
        await addDoc(collection(db, `users/${user.uid}/transactions`), newTransaction);
        toast({
            title: "Transaction Saved",
            description: "The scanned transaction has been added to your records.",
        });
        router.push("/dashboard/transactions");
    } catch(e) {
        console.error(e)
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save the transaction. Please try again.",
        });
    }
  }

  const handleRetry = () => {
    setScannedData(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Scan Receipt</h1>
        <p className="text-muted-foreground">
          Capture a photo of your receipt to automatically add a transaction.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
             {hasCameraPermission === false && (
                <div className="absolute flex flex-col items-center text-center text-muted-foreground">
                    <XCircle className="w-16 h-16 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold">Camera Access Denied</h3>
                    <p>Please enable camera access in your browser settings.</p>
                </div>
            )}
             {hasCameraPermission === null && (
                <div className="absolute flex flex-col items-center text-center text-muted-foreground">
                    <Loader2 className="w-16 h-16 animate-spin mb-4" />
                    <h3 className="text-lg font-semibold">Requesting Camera...</h3>
                </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
           {!scannedData && (
             <Button
                onClick={captureAndScan}
                disabled={isScanning || hasCameraPermission !== true}
                className="w-full"
                size="lg"
              >
                {isScanning ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-5 w-5" />
                )}
                {isScanning ? "Scanning Receipt..." : "Scan Receipt"}
              </Button>
           )}

            {error && (
            <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Scan Failed</AlertTitle>
                <AlertDescription>
                {error}
                <Button variant="link" onClick={handleRetry} className="p-0 h-auto ml-2">Try Again</Button>
                </AlertDescription>
            </Alert>
            )}

            {scannedData && (
                <div className="w-full space-y-4">
                    <Alert variant="default" className="w-full bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Scan Successful!</AlertTitle>
                        <AlertDescription className="text-green-700">
                        Review the details below and save the transaction.
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-medium">Vendor</p>
                            <p className="text-muted-foreground">{scannedData.name}</p>
                        </div>
                         <div>
                            <p className="font-medium">Date</p>
                            <p className="text-muted-foreground">{new Date(scannedData.date).toLocaleDateString()}</p>
                        </div>
                         <div>
                            <p className="font-medium">Category</p>
                            <p className="text-muted-foreground">{scannedData.category}</p>
                        </div>
                         <div>
                            <p className="font-medium">Amount</p>
                            <p className="text-muted-foreground font-semibold">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(scannedData.amount)}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                         <Button onClick={handleRetry} variant="outline" className="w-full">
                            Scan Again
                        </Button>
                        <Button onClick={handleSaveTransaction} className="w-full">
                            Save Transaction
                        </Button>
                    </div>
                </div>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
