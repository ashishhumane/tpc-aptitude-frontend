import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download } from "lucide-react";

const resources = [
  {
    id: 1,
    name: "Aptitude Questions - TCS",
    type: "pdf",
    category: "Company Questions",
    uploadedAt: "2024-02-01",
    link: "/downloads/tcs-aptitude.pdf",
  },
  {
    id: 2,
    name: "Quantitative Aptitude Guide",
    type: "doc",
    category: "Study Material",
    uploadedAt: "2024-01-15",
    link: "/downloads/quant-aptitude.docx",
  },
  {
    id: 3,
    name: "Previous Year Papers - Infosys",
    type: "pdf",
    category: "Previous Papers",
    uploadedAt: "2023-12-20",
    link: "/downloads/infosys-papers.pdf",
  },
  {
    id: 4,
    name: "Logical Reasoning Tricks",
    type: "ppt",
    category: "Study Material",
    uploadedAt: "2024-01-10",
    link: "/downloads/logical-tricks.pptx",
  },
];

const Resources = () => {
  const [search, setSearch] = useState("");

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-full">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">📚 Aptitude Resources</h1>

      {/* Search Bar */}
      <div className="mb-6 flex gap-3">
        <Input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-lg p-3"
        />
      </div>

      {/* Resources Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Available Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>{resource.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{resource.type.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{resource.category}</Badge>
                    </TableCell>
                    <TableCell>{resource.uploadedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" asChild>
                        <a href={resource.link} download>
                          <Download className="h-5 w-5" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No resources found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;
