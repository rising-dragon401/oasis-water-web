export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          company: number | null
          created_at: string
          id: number
          name: string
        }
        Insert: {
          company?: number | null
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          company?: number | null
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_company_fkey"
            columns: ["company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          benefits: string | null
          description: string | null
          health_guideline: number | null
          id: number
          legal_limit: number | null
          measure: string | null
          name: string
          risks: string | null
          sources: Json[] | null
          updated_at: string | null
        }
        Insert: {
          benefits?: string | null
          description?: string | null
          health_guideline?: number | null
          id?: number
          legal_limit?: number | null
          measure?: string | null
          name: string
          risks?: string | null
          sources?: Json[] | null
          updated_at?: string | null
        }
        Update: {
          benefits?: string | null
          description?: string | null
          health_guideline?: number | null
          id?: number
          legal_limit?: number | null
          measure?: string | null
          name?: string
          risks?: string | null
          sources?: Json[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          brand: number | null
          company: number | null
          contaminants: Json[] | null
          created_at: string
          description: string | null
          id: number
          image: string | null
          ingredients: Json[] | null
          metadata: Json | null
          name: string
          score: number | null
          sources: Json[] | null
          type: Database["public"]["Enums"]["item_type"] | null
        }
        Insert: {
          brand?: number | null
          company?: number | null
          contaminants?: Json[] | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          ingredients?: Json[] | null
          metadata?: Json | null
          name: string
          score?: number | null
          sources?: Json[] | null
          type?: Database["public"]["Enums"]["item_type"] | null
        }
        Update: {
          brand?: number | null
          company?: number | null
          contaminants?: Json[] | null
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          ingredients?: Json[] | null
          metadata?: Json | null
          name?: string
          score?: number | null
          sources?: Json[] | null
          type?: Database["public"]["Enums"]["item_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "items_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_company_fkey"
            columns: ["company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      nods_page: {
        Row: {
          checksum: string | null
          id: number
          meta: Json | null
          parent_page_id: number | null
          path: string
          source: string | null
          type: string | null
        }
        Insert: {
          checksum?: string | null
          id?: number
          meta?: Json | null
          parent_page_id?: number | null
          path: string
          source?: string | null
          type?: string | null
        }
        Update: {
          checksum?: string | null
          id?: number
          meta?: Json | null
          parent_page_id?: number | null
          path?: string
          source?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nods_page_parent_page_id_fkey"
            columns: ["parent_page_id"]
            isOneToOne: false
            referencedRelation: "nods_page"
            referencedColumns: ["id"]
          }
        ]
      }
      nods_page_section: {
        Row: {
          content: string | null
          embedding: string | null
          heading: string | null
          id: number
          page_id: number
          slug: string | null
          token_count: number | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          heading?: string | null
          id?: number
          page_id: number
          slug?: string | null
          token_count?: number | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          heading?: string | null
          id?: number
          page_id?: number
          slug?: string | null
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nods_page_section_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "nods_page"
            referencedColumns: ["id"]
          }
        ]
      }
      tap_water_locations: {
        Row: {
          contaminants: Json[] | null
          contaminants_exceeding_guidelines: number | null
          created_at: string
          id: number
          image: string | null
          name: string
          score: number | null
          total_contaminants: number | null
          zip_codes: number[]
        }
        Insert: {
          contaminants?: Json[] | null
          contaminants_exceeding_guidelines?: number | null
          created_at?: string
          id?: number
          image?: string | null
          name: string
          score?: number | null
          total_contaminants?: number | null
          zip_codes: number[]
        }
        Update: {
          contaminants?: Json[] | null
          contaminants_exceeding_guidelines?: number | null
          created_at?: string
          id?: number
          image?: string | null
          name?: string
          score?: number | null
          total_contaminants?: number | null
          zip_codes?: number[]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_page_parents: {
        Args: {
          page_id: number
        }
        Returns: {
          id: number
          parent_page_id: number
          path: string
          meta: Json
        }[]
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_page_sections: {
        Args: {
          embedding: string
          match_threshold: number
          match_count: number
          min_content_length: number
        }
        Returns: {
          id: number
          page_id: number
          slug: string
          heading: string
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      bottled_water_metadata: "source" | "treatment_process" | "ph_level"
      item_type: "bottled_water"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
